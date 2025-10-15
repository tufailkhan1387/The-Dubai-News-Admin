import JoditEditor from "jodit-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import Sidebar from "../components/Sidebar";
import { error_toaster, success_toaster } from "../Utils/Toaster";
import { BASE_URL, FRONT_SITE } from "../Utils/urls";

// ---------- helpers ----------
const stripHtml = (html = "") =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00A0/g, " ")
    .trim();

// Make editor HTML responsive/clean
const normalizeContentForNews = (html) => {
  const root = document.createElement("div");
  root.innerHTML = html || "";

  root.querySelectorAll("img").forEach((img) => {
    img.removeAttribute("width");
    img.removeAttribute("height");
    img.classList.remove("float-left", "float-right", "jodit-image_left", "jodit-image_right");
    img.style.width = "100%";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "1rem 0";
  });

  root.querySelectorAll("figure").forEach((f) => {
    f.style.margin = "1rem 0";
  });

  return root.innerHTML;
};

// Instagram helpers
const ensureIgScript = () => {
  if (!document.getElementById("ig-embed-script")) {
    const s = document.createElement("script");
    s.id = "ig-embed-script";
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => window.instgrm?.Embeds?.process();
    document.head.appendChild(s);
  } else {
    window.instgrm?.Embeds?.process();
  }
};

const toIgPermalink = (href) => {
  try {
    const u = new URL(href);
    if (!/(\.|^)instagram\.com$/i.test(u.hostname)) return null;
    const m = u.pathname.match(/\/(p|reel|tv)\/([^\/?#]+)/i);
    return m ? `https://www.instagram.com/${m[1]}/${m[2]}/` : null;
  } catch {
    return null;
  }
};

export default function EditNews() {
  const location = useLocation();
  const navigate = useNavigate();
  const newsId = location?.state?.id;

  // Lookups + single news payload
  const { apiData: newsResp } = useFetch(`/admin/newsData/${newsId}`);
  const { apiData: lookupsResp } = useFetch("/admin/dataForNews");

  // State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const [cityId, setCityId] = useState("");
  const [cityCategories, setCityCategories] = useState([]); // fetched from /admin/getCityCategories
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySubcategories, setCategorySubcategories] = useState([]); // fetched via /admin/getCategorySubcategories
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [template, setTemplate] = useState(null);

  const [contentHtml, setContentHtml] = useState("");
  const prefilledRef = useRef(false);

  // RHF
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      newsTitle: "",
      seoTitle: "",
      slug: "",
      seoDescription: "",
      tags: "",
      categoryId: "",
      subcategoryId: "",
      content: "",
    },
  }); const generateSlug = (text = "") =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");


  // Keep RHF synced with editor HTML
  useEffect(() => {
    setValue("content", contentHtml, { shouldValidate: true });
  }, [contentHtml, setValue]);

  const cities = lookupsResp?.data?.cities || [];

  // ----- Jodit config (matches Create) -----
  const config = useMemo(() => ({
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insertAsHTML",

    height: 500,
    minHeight: 400,
    readonly: false,
    buttons: ["source", "|", "bold", "italic", "underline", "|", "ul", "ol", "|", "link", "image", "video", "table", "|", "eraser", "undo", "redo"],

    // cleanHTML: {
    //   // removeScript: true,
    //   allowTags: {
    //     img: ["src", "alt", "title", "style", "width", "height"],
    //     blockquote: ["class", "data-instgrm-permalink", "data-instgrm-version", "style"],
    //   },
    // },

    events: {
      beforePaste: function (_evt, data) {
        const html = (data?.html || "").trim();
        const text = (data?.text || "").trim();
        let href = null;

        if (html) {
          try {
            const doc = new DOMParser().parseFromString(html, "text/html");
            href = doc.querySelector("a[href]")?.getAttribute("href") || null;
          } catch { }
        }
        if (!href && text) href = text;

        const permalink = href ? toIgPermalink(href) : null;
        if (!permalink) return;

        data.html = `<blockquote class="instagram-media"
                       data-instgrm-permalink="${permalink}"
                       data-instgrm-version="14"
                       style="width:100%;margin:1rem 0;"></blockquote>`;
        data.text = "";
      },
      afterPaste: function () {
        setTimeout(ensureIgScript, 0);
      },
    },

    uploader: {
      url: `${BASE_URL}/admin/editor-image`,
      method: "POST",
      withCredentials: false,
      insertImageAsBase64URI: false,
      filesVariableName: () => "image",
      baseurl: "",
      isSuccess: (r) => r?.status === "1" && !!r?.data?.url,
      getMessage: (r) => r?.message || "Upload failed",
      process: (r) => ({
        files: [String(r.data.url).replace(/\\/g, "/")],
        baseurl: "",
      }),
      defaultHandlerSuccess: function (data) {
        (data?.files || []).forEach((src) => this.s.insertImage(src));
      },
    },
  }), []);

  // ---------- Prefill (Step 1) ----------
  useEffect(() => {
    const n = newsResp?.status === "1" ? newsResp?.data?.newsData : null;
    if (!n || prefilledRef.current) return;

    // Titles/meta/content/thumbnail
    setValue("newsTitle", n.title || "");
    setValue("slug", n.slug || "");

    setValue("seoTitle", n.seo_title || "");
    setValue("seoDescription", n.seo_description || "");
    setValue("tags", n.tags || "");
    setContentHtml(n.content || "");
    setTemplate(n.template || "template1");
    setValue("content", n.content || "");
    setThumbPreview(n.thumbnail || null);

    // Derive city
    const derivedCity =
      n.cityId ??
      (Array.isArray(n.cityIds) && n.cityIds.length ? n.cityIds[0] : undefined) ??
      (Array.isArray(n.newsCities) && n.newsCities.length ? n.newsCities[0].cityId : "");
    const cityStr = derivedCity ? String(derivedCity) : "";
    setCityId(cityStr);

    // We’ll fetch categories after city is set (see effect below)
    // Category/Subcategory will be set in Step 2 after we populate dropdowns
    prefilledRef.current = true;
  }, [newsResp, setValue]);

  // When city changes, fetch its categories (same as Create)
  useEffect(() => {
    if (!cityId) {
      setCityCategories([]);
      setSelectedCategory("");
      setSelectedSubcategory("");
      setValue("categoryId", "");
      setValue("subcategoryId", "");
      return;
    }

    (async () => {
      try {
        const res = await PostApi("/admin/getCityCategories", { cityId }, true);
        if (res?.data?.status === "1") {
          const fetched = res.data.data.cityCategories
            .map((cc) => cc.category)
            .filter((cat) => cat && cat.status)
            .map((cat) => ({ id: String(cat.id), name: cat.name }));
          const unique = Array.from(new Map(fetched.map((c) => [c.id, c])).values());
          setCityCategories(unique);
        } else {
          error_toaster(res?.data?.message || "Failed to fetch city categories");
          setCityCategories([]);
        }
      } catch (e) {
        console.error("City categories error:", e);
        error_toaster("Something went wrong while fetching categories");
        setCityCategories([]);
      }
    })();
  }, [cityId, setValue]);

  // When category changes, fetch its subcategories (same as Create)
  useEffect(() => {
    if (!selectedCategory) {
      setCategorySubcategories([]);
      setSelectedSubcategory("");
      setValue("subcategoryId", "");
      return;
    }

    (async () => {
      try {
        const res = await PostApi("/admin/getCategorySubcategories", { categoryId: selectedCategory }, true);
        if (res?.data?.status === "1") {
          const fetched = res.data.data.subcategories
            .filter((s) => s && s.status)
            .map((s) => ({ id: String(s.id), name: s.name }));
          setCategorySubcategories(fetched);
        } else {
          error_toaster(res?.data?.message || "Failed to fetch subcategories");
          setCategorySubcategories([]);
        }
      } catch (e) {
        console.error("Subcategories error:", e);
        error_toaster("Something went wrong while fetching subcategories");
        setCategorySubcategories([]);
      }
    })();
  }, [selectedCategory, setValue]);

  // ---------- Prefill (Step 2): set category/subcategory after dropdowns ready ----------
  useEffect(() => {
    const n = newsResp?.status === "1" ? newsResp?.data?.newsData : null;
    if (!n) return;

    // Category
    const catStr = n.categoryId ? String(n.categoryId) : "";
    if (catStr && cityCategories.some((c) => c.id === catStr) && selectedCategory !== catStr) {
      setSelectedCategory(catStr);
      setValue("categoryId", catStr);
    }

    // Subcategory will be set after categorySubcategories loads
  }, [newsResp, cityCategories, selectedCategory, setValue]);

  useEffect(() => {
    const n = newsResp?.status === "1" ? newsResp?.data?.newsData : null;
    if (!n) return;
    const subStr = n.subCategoryId ? String(n.subCategoryId) : "";
    if (!subStr) return;
    if (categorySubcategories.some((s) => s.id === subStr)) {
      setSelectedSubcategory(subStr);
      setValue("subcategoryId", subStr);
    }
  }, [newsResp, categorySubcategories, setValue]);

  // ---------- Submit (supports draft / publish / preview) ----------
  const submitWithStatus = async (data, status) => {
    if (!cityId) return error_toaster("Please select a city");

    if (!data.categoryId) return error_toaster("Please select a category");
    if (!data.subcategoryId) return error_toaster("Please select a subcategory");
    if (!data.newsTitle?.trim()) return error_toaster("News title is required");
    if (!data.content || !stripHtml(data.content)) return error_toaster("Please add content");

    const isPreview = status === "preview";
    localStorage.setItem("title", data.newsTitle.trim());
    const previewWindow = isPreview ? window.open("", "_blank") : null;

    try {
      const formData = new FormData();
      formData.append("id", String(newsId));
      formData.append("slug", data.slug || "");

      formData.append("title", data.newsTitle.trim());
      formData.append("categoryId", data.categoryId);
      formData.append("subcategoryId", data.subcategoryId);

      const cleaned = normalizeContentForNews(data.content);
      formData.append("content", cleaned);

      formData.append("status", status);
      formData.append("tags", data.tags || "");
      formData.append("seo_title", data.seoTitle || "");
      formData.append("seo_description", data.seoDescription || "");
      formData.append("cityId", cityId || "");
      formData.append("template", template || "template1");

      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const res = await PostApi("/admin/updateNews", formData, true);

      if (res?.data?.status === "1") {
        success_toaster("News updated successfully");

        if (isPreview) {
          const url = `${FRONT_SITE}/preview/${newsId}`;
          if (previewWindow) previewWindow.location.replace(url);
        } else {
          navigate("/news");
        }
      } else {
        error_toaster(res?.data?.message || "Something went wrong");
        if (previewWindow) previewWindow.close();
      }
    } catch (err) {
      console.error("Update News Error:", err);
      error_toaster("Something went wrong");
      if (isPreview) window.close();
    }
  };

  // ---------- UI ----------
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header">
            <h4>Edit News</h4>
            <h6>Update meta, city & content</h6>
          </div>

          <form className="card p-3">
            <h5>News Information</h5>

            <div className="row">
              {/* News Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label">News Title</label>
                <input
                  className="form-control"
                  {...register("newsTitle", { required: true })}
                  onChange={(e) => {
                    const title = e.target.value;
                    setValue("newsTitle", title);
                    setValue("slug", generateSlug(title)); // auto update slug
                  }}
                />
              </div>

              {/* Slug */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
                  {...register("slug", { required: true })}
                  value={watch("slug") || ""}
                  onChange={(e) => setValue("slug", generateSlug(e.target.value))}
                />
              </div>


              <div className="col-md-6 mb-3">
                <label className="form-label">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setThumbnailFile(file);
                      setThumbPreview(URL.createObjectURL(file));
                    } else {
                      setThumbnailFile(null);
                      setThumbPreview(null);
                    }
                  }}
                />
                {thumbPreview && (
                  <img
                    src={thumbPreview}
                    alt="Thumbnail preview"
                    className="mt-2"
                    style={{ maxHeight: "120px", borderRadius: "6px" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            </div>

            {/* City → Category → Subcategory */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  value={cityId}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setCityId(selected);
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setValue("categoryId", "");
                    setValue("subcategoryId", "");
                  }}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={String(city.id)}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    setValue("categoryId", value);
                    setSelectedSubcategory("");
                    setValue("subcategoryId", "");
                  }}
                  disabled={!cityId}
                >
                  <option value="">Select</option>
                  {cityCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Subcategory</label>
                <select
                  className="form-select"
                  value={selectedSubcategory}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedSubcategory(v);
                    setValue("subcategoryId", v);
                  }}
                  disabled={!categorySubcategories.length}
                >
                  <option value="">Select</option>
                  {categorySubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Templates</label>
                <select
                  className="form-select"
                  value={template}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTemplate(value);

                  }}

                >
                  <option value="">Select Template</option>
                  <option value="template1">Template1</option>
                  <option value="template2">Template 2</option>
                </select>
              </div>
            </div>

            {/* SEO & Tags */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-control" {...register("tags")} placeholder="Enter tags separated by commas" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">SEO Title</label>
                <input className="form-control" {...register("seoTitle")} placeholder="Enter SEO title" />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">SEO Description</label>
                <textarea className="form-control" rows={3} {...register("seoDescription")} placeholder="Enter SEO description" />
                {/* Example to auto-fill from content */}
                {/* <button type="button" className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => setValue("seoDescription", stripHtml(contentHtml).slice(0, 160))}>
                      Use first 160 chars from content
                   </button> */}
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <JoditEditor value={contentHtml} config={config} onChange={(v) => setContentHtml(v)} />
              <input type="hidden" {...register("content")} />
            </div>

            {/* Actions */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => submitWithStatus(data, "draft"))}
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>

              <button
                type="button"
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => submitWithStatus(data, "publish"))}
              >
                {isSubmitting ? "Publishing..." : "Update & Publish"}
              </button>

              <button
                type="button"
                className="btn btn-warning"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => submitWithStatus(data, "preview"))}
              >
                {isSubmitting ? "Previewing..." : "Preview"}
              </button>

              <button
                type="button"
                className="btn btn-light ms-auto"
                onClick={() => {
                  reset();
                  setCityId("");
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  setContentHtml("");
                  setThumbnailFile(null);
                  setThumbPreview(null);
                  prefilledRef.current = false;
                }}
                disabled={isSubmitting}
              >
                Reset All
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
}

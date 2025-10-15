import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import Sidebar from "../components/Sidebar";
import { error_toaster, success_toaster } from "../Utils/Toaster";
import { BASE_URL, FRONT_SITE } from "../Utils/urls";
import "./CreateNews.css";

export default function CreateNews() {
  const { apiData } = useFetch("/admin/dataForNews");

  // State
  const [cityId, setCityId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySubcategories, setCategorySubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [cityCategories, setCityCategories] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [template, setTemplate] = useState("template1");
  const [videoUrl, setVideoUrl] = useState(""); // Added state for video URL

  // Normalize editor content
  const normalizeContentForNews = (html) => {
    const root = document.createElement("div");
    root.innerHTML = html || "";
    root.querySelectorAll("img").forEach((img) => {
      img.removeAttribute("width");
      img.removeAttribute("height");
      img.classList.remove(
        "float-left",
        "float-right",
        "jodit-image_left",
        "jodit-image_right"
      );
      img.style.width = "100%";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "1rem 0";
    });
    return root.innerHTML;
  };

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      newsTitle: "",
      slug: "",
      categoryId: "",
      subcategoryId: "",
      content: "",
      tags: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  // Generate slug from title
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  // Keep editor synced
  useEffect(() => {
    setValue("content", contentHtml, { shouldValidate: true });
  }, [contentHtml, setValue]);

  const cities = apiData?.data?.cities || [];

  // Editor config
  const config = {
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insertAsHTML",
    height: 500,
    minHeight: 400,
    readonly: false,
    observer: {
      timeout: 300
    },
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "video",
      "table",
      "|",
      "eraser",
      "undo",
      "redo",
    ],

    uploader: {
      url: `${BASE_URL}/admin/editor-image`,
      method: "POST",
      withCredentials: false,
      insertImageAsBase64URI: false,
      filesVariableName: () => "image",
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
  };

  // Submit handler
  const submitWithStatus = async (data, status) => {

    if (!cityId) return error_toaster("Please select at least one city");
    if (!data.categoryId) return error_toaster("Please select a category");
    if (!data.subcategoryId) return error_toaster("Please select a subcategory");
    if (!template) return error_toaster("Please select a Template");
    if (!data.newsTitle?.trim())
      return error_toaster("News title is required");
    if (!data.content || !data.content.trim())
      return error_toaster("Please add content");

    const isPreview = status === "preview";
    const previewWindow = isPreview ? window.open("", "_blank") : null;

    try {
      const formData = new FormData();
      formData.append("title", data.newsTitle.trim());
      formData.append("slug", data.slug);
      formData.append("categoryId", data.categoryId);
      formData.append("subcategoryId", data.subcategoryId);
      formData.append("content", normalizeContentForNews(data.content));
      formData.append("status", status);
      formData.append("tags", data.tags || "");
      formData.append("seo_title", data.seoTitle || "");
      formData.append("seo_description", data.seoDescription || "");
      formData.append("cityId", cityId || "");
      formData.append("template", template || "template1");
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      if (videoUrl) formData.append("videoUrl", videoUrl); // Added video URL to form data

      const res = await PostApi("/admin/addNews", formData, true);

      if (res?.data?.status === "1") {
        success_toaster("News created successfully");
        if (isPreview) {
          const url = `${FRONT_SITE}/preview/${res?.data?.data?.id}`;
          if (previewWindow) previewWindow.location.replace(url);
        } else {
          reset();
          setCityId("");
          setSelectedCategory("");
          setSelectedSubcategory("");
          setContentHtml("");
          setThumbnailFile(null);
          setThumbPreview(null);
        }
      } else {
        error_toaster(res?.data?.message || "Something went wrong");
        if (previewWindow) previewWindow.close();
      }
    } catch (err) {
      console.error("Add News Error:", err);
      error_toaster("Failed to create news");
      if (previewWindow) previewWindow.close();
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header">
            <h4>Create News</h4>
            <h6>News meta & content</h6>
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
                    setValue("slug", generateSlug(title)); // auto-generate slug
                  }}
                />
              </div>

              {/* Slug */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
                  {...register("slug", { required: true })}
                  onChange={(e) => setValue("slug", generateSlug(e.target.value))}
                />
              </div>


              {/* Thumbnail */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Thumbnail (300x300 size recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check image dimensions
                      const img = new Image();
                      img.src = URL.createObjectURL(file);
                      img.onload = () => {
                        // if (img.width !== 300 || img.height !== 300) {
                        //   error_toaster("Please upload an image with 300x300 dimensions");
                        //   e.target.value = "";
                        //   return;
                        // }
                        setThumbnailFile(file);
                        setThumbPreview(URL.createObjectURL(file));
                      };
                    } else {
                      setThumbnailFile(null);
                      setThumbPreview(null);
                    }
                  }}
                />
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt="Thumbnail preview"
                    className="mt-2"
                    style={{ maxHeight: "120px", borderRadius: "6px" }}
                  />
                ) : null}
              </div>

              {/* YouTube Video URL */}
              <div className="col-md-6 mb-3">
                <label className="form-label">YouTube Video URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* City Selection */}
            <div className="row">
              {/* City */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Select City</label>
                <select
                  className="form-select"
                  value={cityId}
                  onChange={async (e) => {
                    const selectedCityId = e.target.value;
                    setCityId(selectedCityId);
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setValue("categoryId", "");
                    setValue("subcategoryId", "");
                    try {
                      const res = await PostApi(
                        "/admin/getCityCategories",
                        { cityId: selectedCityId },
                        false
                      );
                      if (res?.data?.status === "1") {
                        const fetchedCategories =
                          res.data.data.cityCategories.map((cc) => ({
                            id: String(cc.category.id),
                            name: cc.category.name,
                          }));
                        const uniqueCategories = Array.from(
                          new Map(fetchedCategories.map((c) => [c.id, c])).values()
                        );
                        setCityCategories(uniqueCategories);
                      } else {
                        error_toaster(res?.data?.message);
                        setCityCategories([]);
                      }
                    } catch (err) {
                      console.error("Error fetching city categories:", err);
                      error_toaster("Failed to fetch city categories");
                      setCityCategories([]);
                    }
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

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    setValue("categoryId", value);
                    setSelectedSubcategory("");
                    setValue("subcategoryId", "");
                    try {
                      const res = await PostApi(
                        "/admin/getCategorySubcategories",
                        { categoryId: value },
                        false
                      );
                      if (res?.data?.status === "1") {
                        setCategorySubcategories(
                          res.data.data.subcategories.map((sub) => ({
                            id: String(sub.id),
                            name: sub.name,
                          }))
                        );
                      } else {
                        error_toaster(res?.data?.message);
                        setCategorySubcategories([]);
                      }
                    } catch (err) {
                      console.error("Error fetching subcategories:", err);
                      error_toaster("Failed to fetch subcategories");
                      setCategorySubcategories([]);
                    }
                  }}
                >
                  <option value="">Select</option>
                  {cityCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Subcategory</label>
                <select
                  className="form-select"
                  value={selectedSubcategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSubcategory(value);
                    setValue("subcategoryId", value);
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
                  <option value="template3">Template 3</option>
                </select>
              </div>
            </div>

            {/* Tags / SEO */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags</label>
                <input
                  className="form-control"
                  {...register("tags")}
                  placeholder="Comma separated"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">SEO Title</label>
                <input
                  className="form-control"
                  {...register("seoTitle")}
                  placeholder="Enter SEO title"
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">SEO Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register("seoDescription")}
                  placeholder="Enter SEO description"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <JoditEditor
                value={contentHtml}
                config={config}
                onBlur={(newContent) => setContentHtml(newContent)}
              />
              {/* <JoditEditor
                value={contentHtml}
                config={config}
                onBlur={newContent => setContentHtml(newContent)}
                onChange={(v) => setContentHtml(v)}
              /> */}
              <input type="hidden" {...register("content")} />
            </div>

            {/* Actions */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={handleSubmit((data) =>
                  submitWithStatus(data, "draft")
                )}
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={handleSubmit((data) =>
                  submitWithStatus(data, "publish")
                )}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
              <button
                type="button"
                className="btn btn-warning"
                disabled={isSubmitting}
                onClick={handleSubmit((data) =>
                  submitWithStatus(data, "preview")
                )}
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

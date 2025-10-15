import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import useFetch from "../../ApiClient/GetApi";
import { error_toaster, success_toaster } from "../../Utils/Toaster";
import { PostApi } from "../../ApiClient/PostApi";
import Sidebar from "../../components/Sidebar";

// --- helpers ---
const stripHtml = (html = "") =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")   // drop styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // drop scripts
    .replace(/<[^>]+>/g, "")                          // strip tags
    .replace(/\u00A0/g, " ")                          // nbsp -> space
    .trim();

export default function WriterEditNews() {
  const location = useLocation();
  const navigate = useNavigate();

  // fetch single news + lookups
  const { apiData } = useFetch(`/admin/newsData/${location?.state?.id}`);
  const lookups = useFetch("/admin/dataForNews");

  // state
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const [selectedCity, setSelectedCity] = useState("");        // single city
  const [selectedCategory, setSelectedCategory] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  const prefilledRef = useRef(false);

  // RHF
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      newsTitle: "",
      seoTitle: "",
      tags: "",
      seoDescription: "",
      categoryId: "",
      subcategoryId: "",
      content: "",
    },
  });

  // editor config
  const config = {
    height: 500,
    minHeight: 400,
    readonly: false,
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
    uploader: { insertImageAsBase64URI: true },
  };

  // Keep RHF content in sync with Jodit (store HTML)
  useEffect(() => {
    setValue("content", contentHtml, { shouldValidate: true });
  }, [contentHtml, setValue]);

  // options
  const cities = lookups?.apiData?.data?.cities || [];
  const categories = lookups?.apiData?.data?.categories || [];
  const subcategories = lookups?.apiData?.data?.subcategories || [];

  // filter categories by the single selected city
  const filteredCategories = useMemo(() => {
    if (!selectedCity) return [];
    return categories.filter((cat) => String(cat.cityId) === String(selectedCity));
  }, [categories, selectedCity]);

  // filter subcategories by selected category
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter(
      (sub) => String(sub.categoryId) === String(selectedCategory)
    );
  }, [subcategories, selectedCategory]);

  // Plain-text (no tags) derived from editor HTML
  const contentPlain = useMemo(() => stripHtml(contentHtml), [contentHtml]);

  /**
   * PREFILL STEP 1
   */
  useEffect(() => {
    const hasLookups = Array.isArray(cities) && Array.isArray(categories) && Array.isArray(subcategories);
    const n = apiData?.status === "1" ? apiData?.data?.newsData : null;

    if (!n || !hasLookups || prefilledRef.current) return;

    // Title / Content / Thumb
    setValue("newsTitle", n.title || "");
    setValue("seoTitle", n.seo_title || "");
    setValue("seoDescription", n.seo_description || "");
    setValue("tags", n.tags || "");
    setContentHtml(n.content || "");
    setValue("content", n.content || "");
    setThumbPreview(n.thumbnail || null);

    // City
    const derivedCity =
      n.cityId ??
      (Array.isArray(n.cityIds) && n.cityIds.length ? n.cityIds[0] : undefined) ??
      (Array.isArray(n.newsCities) && n.newsCities.length ? n.newsCities[0].cityId : "");
    const cityStr = derivedCity ? String(derivedCity) : "";
    setSelectedCity(cityStr);

    // Category
    const catStr = n.categoryId ? String(n.categoryId) : "";
    setSelectedCategory(catStr);
    setValue("categoryId", catStr);

    prefilledRef.current = true;
  }, [apiData, cities, categories, subcategories, setValue]);

  /**
   * PREFILL STEP 2
   */
  useEffect(() => {
    const n = apiData?.status === "1" ? apiData?.data?.newsData : null;
    if (!n) return;

    const targetSubId = n.subCategoryId ? String(n.subCategoryId) : "";
    if (!targetSubId || !filteredSubcategories.length) return;

    if (getValues("subcategoryId") !== targetSubId) {
      const exists = filteredSubcategories.some((s) => String(s.id) === targetSubId);
      if (exists) setValue("subcategoryId", targetSubId);
    }
  }, [apiData, filteredSubcategories, getValues, setValue]);

  // Submit
  const onSubmit = async (data) => {
    if (!selectedCity) return error_toaster("Please select a city");
    if (!data.categoryId) return error_toaster("Please select a category");
    if (!data.subcategoryId) return error_toaster("Please select a subcategory");
    if (!data.newsTitle?.trim()) return error_toaster("News title is required");
    if (!data.content || !stripHtml(data.content)) return error_toaster("Please add content");

    try {
      const formData = new FormData();
      formData.append("id", String(location?.state?.id));
      formData.append("title", data.newsTitle.trim());
      formData.append("categoryId", data.categoryId);
      formData.append("subcategoryId", data.subcategoryId);

      // Save HTML (from Jodit)
      formData.append("content", data.content);

      // If you also want to send plain text to backend (optional, uncomment):
      // formData.append("content_plain", stripHtml(data.content));

      formData.append("cityId", selectedCity);
      formData.append("seo_title", data.seoTitle || "");
      formData.append("seo_description", data.seoDescription || "");
      formData.append("tags", data.tags || "");

      if (thumbnailFile instanceof File) {
        formData.append("thumbnail", thumbnailFile);
      }

      const res = await PostApi("/admin/updateNews", formData, true);
      if (res?.data?.status === "1") {
        success_toaster("News updated successfully");
        navigate("/writer-news");
      } else {
        error_toaster(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Update News Error:", err);
      error_toaster("Something went wrong");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header">
            <h4>Edit News</h4>
            <h6>Update meta, city & content</h6>
          </div>

          <form className="card p-3" onSubmit={handleSubmit(onSubmit)}>
            <h5>News Information</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">News Title</label>
                <input
                  className="form-control"
                  {...register("newsTitle", { required: true })}
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
              {/* City (single select) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <select
                  className="form-select"
                  value={selectedCity}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedCity(selected);
                    // reset dependents
                    setSelectedCategory("");
                    setValue("categoryId", "");
                    setValue("subcategoryId", "");
                  }}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={String(city.id)}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category (filtered by city) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    setValue("categoryId", value);
                    setValue("subcategoryId", "");
                  }}
                  disabled={!selectedCity}
                >
                  <option value="">Select</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory (filtered by category) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Subcategory</label>
                <select
                  className="form-select"
                  {...register("subcategoryId")}
                  disabled={!selectedCategory}
                >
                  <option value="">Select</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={String(sub.id)}>
                      {sub.name}
                    </option>
                  ))}
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
                {/* If you want to auto-fill from plain text excerpt: */}
                {/* <button type="button" className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => setValue("seoDescription", contentPlain.slice(0, 160))}>
                    Use first 160 chars from content
                  </button> */}
              </div>
            </div>
            {/* Content (Jodit) */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <JoditEditor
                value={contentHtml}
                config={config}
                onBlur={(newContent) => setContentHtml(newContent)}
                onChange={() => {}}
              />
              <input type="hidden" {...register("content")} />
            </div>

          

           

            {/* Submit */}
            <div className="mt-3">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update News"}
              </button>
              <button
                type="button"
                className="btn btn-light ms-2"
                onClick={() => {
                  reset();
                  setSelectedCity("");
                  setSelectedCategory("");
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
      </div>
    </div>
  );
}

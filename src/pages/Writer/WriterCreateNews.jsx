import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import { error_toaster, success_toaster } from "../../Utils/Toaster";
import useFetch from "../../ApiClient/GetApi";
import { PostApi } from "../../ApiClient/PostApi";
import Sidebar from "../../components/Sidebar";

export default function WriterCreateNews() {
  const { apiData } = useFetch("/admin/dataForNews");
  // State
  const [cityId, setCityId] = useState(""); // array of cityId strings
  const [selectedCategory, setSelectedCategory] = useState(""); // categoryId string
  const [categorySubcategories, setCategorySubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [cityCategories, setCityCategories] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      newsTitle: "",
      categoryId: "",
      subcategoryId: "",
      content: "",
    },
  });

  // Keep RHF synced with editor
  useEffect(() => {
    setValue("content", contentHtml, { shouldValidate: true });
  }, [contentHtml, setValue]);

  const cities = apiData?.data?.cities || [];
  const globalSubcategories = apiData?.data?.subcategories || [];

  /**
   * Build category list from selected cities:
   * - Traverse selected cities -> their cityCategories -> category
   * - Deduplicate categories by id (union across cities)
   */



  // Editor config
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
console.log(thumbnailFile)
  const submitWithStatus = async (data, status) => {
    if (!cityId) return error_toaster("Please select at least one city");
    if (!data.categoryId) return error_toaster("Please select a category");
    if (!data.subcategoryId) return error_toaster("Please select a subcategory");
    if (!data.newsTitle?.trim()) return error_toaster("News title is required");
    if (!data.content || !data.content.trim()) return error_toaster("Please add content");

    try {
      const formData = new FormData();
      formData.append("title", data.newsTitle.trim());
      formData.append("categoryId", data.categoryId);
      formData.append("subcategoryId", data.subcategoryId);
      formData.append("content", data.content);
      formData.append("status", status);
      formData.append("tags", data.tags || "");
      formData.append("seo_title", data.seoTitle || "");
      formData.append("seo_description", data.seoDescription || "");
      formData.append("cityId", cityId || "");




   formData.append("thumbnail", thumbnailFile);

      const res = await PostApi("/admin/addNews", formData, true);
      if (res?.data?.status === "1") {
        success_toaster("News created successfully");
        reset();
        setCityId("");
        setSelectedCategory("");
        setContentHtml("");
        setThumbnailFile(null);
        setThumbPreview(null);
      } else {
        error_toaster(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Add News Error:", err);
      error_toaster("Failed to create news");
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
              <div className="col-md-6 mb-3">
                <label className="form-label">News Title</label>
                <input className="form-control" {...register("newsTitle", { required: true })} />
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
                  />
                )}
              </div>
            </div>

            {/* Cities → Categories → Subcategories */}
            <div className="row">
              {/* Cities (multi-select) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Select City</label>
                <select
                  className="form-select"
                  value={cityId}
                  onChange={async (e) => {
                    const selectedCityId = e.target.value; // <-- Correct way to get selected value
                    setCityId(selectedCityId);

                    // Reset dependent fields
                    setSelectedCategory("");
                    setValue("categoryId", "");
                    setValue("subcategoryId", "");

                    try {
                      // Fetch city categories from API
                      const res = await PostApi("/admin/getCityCategories", { cityId: selectedCityId }, true);
                      if (res?.data?.status === "1") {
                        const fetchedCategories = res.data.data.cityCategories
                          .map((cc) => cc.category)
                          .filter((cat) => cat && cat.status) // optional: only active categories
                          .map((cat) => ({
                            id: String(cat.id),
                            name: cat.name,
                          }));

                        // Deduplicate by id
                        const uniqueCategories = Array.from(new Map(fetchedCategories.map(c => [c.id, c])).values());

                        setCityCategories(uniqueCategories);
                      } else {
                        error_toaster(res?.data?.message || "Failed to fetch city categories");
                        setCityCategories([]);
                      }
                    } catch (err) {
                      console.error("Error fetching city categories:", err);
                      error_toaster("Something went wrong while fetching categories");
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


              {/* Category (union from selected cities) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    setValue("categoryId", value);

                    // Reset subcategory
                    setSelectedSubcategory("");
                    setValue("subcategoryId", "");

                    if (!value) {
                      setCategorySubcategories([]);
                      return;
                    }

                    try {
                      // Call API to get subcategories for selected category
                      const res = await PostApi("/admin/getCategorySubcategories", { categoryId: value }, true);

                      if (res?.data?.status === "1") {
                        const fetchedSubcategories = res.data.data.subcategories
                          .filter((sub) => sub && sub.status) // optional: only active
                          .map((sub) => ({
                            id: String(sub.id),
                            name: sub.name,
                          }));

                        setCategorySubcategories(fetchedSubcategories);
                      } else {
                        error_toaster(res?.data?.message || "Failed to fetch subcategories");
                        setCategorySubcategories([]);
                      }
                    } catch (err) {
                      console.error("Error fetching subcategories:", err);
                      error_toaster("Something went wrong while fetching subcategories");
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

              {/* Subcategory (from the chosen category’s nested subCategories) */}
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
            </div>
            {/* Tags, SEO Title & SEO Description */}
            <div className="row">
              {/* Tags */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  className="form-control"
                  {...register("tags")}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              {/* SEO Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label">SEO Title</label>
                <input
                  className="form-control"
                  {...register("seoTitle")}
                  placeholder="Enter SEO title"
                />
              </div>

              {/* SEO Description */}
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
                onChange={() => { }}
              />
              <input type="hidden" {...register("content")} />
            </div>

            {/* Submit */}
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
                {isSubmitting ? "Publishing..." : "Publish"}
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
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Loader from "../Utils/Loader";
import Select from "react-select";

const API = {
    getAllCategories: "/admin/getAllCategories",
    getSubcategories: "/admin/getCategorySubcategories",
    getSubcategoryNews: "/admin/getSubcategoryNews",
    saveTrending: "/admin/setCategoryTrending",
};

export default function CategoryTrendingNews() {
    const { apiData: catsRes, loading: catsLoading } = useFetch(API.getAllCategories);
    const { apiData: trendingNews, reFetch } = useFetch("/admin/getCategoryTrendingNews");
    const [loading, setLoading] = useState(false);

    const trending = useMemo(() => {
        const arr = trendingNews?.data?.newsData || [];
        return arr.map((row) => ({
            id: row?.newsId,
            title: row?.news?.title || "(no title)",
            createdAt: row?.createdAt,
            categoryId: row?.categoryId,
        }));
    }, [trendingNews]);

    const categories = useMemo(
        () => (Array.isArray(catsRes?.data?.categories) ? catsRes.data.categories : []),
        [catsRes]
    );

    // State for multiple category rows
    const [categoryRows, setCategoryRows] = useState([{
        id: 1,
        categoryId: "",
        subCategoryId: "",
        subCategories: [],
        news: [],
        selectedOptions: [],
        loadingSub: false,
        loadingNews: false
    }]);

    const LIMIT = 10;

    const handleCategoryChange = async (rowId, e) => {
        const id = e.target.value;

        setCategoryRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        categoryId: id,
                        subCategoryId: "",
                        subCategories: [],
                        news: [],
                        selectedOptions: [],
                        loadingSub: true
                    }
                    : row
            )
        );

        if (!id) return;

        try {
            const res = await PostApi(API.getSubcategories, { categoryId: Number(id) });
            const list = res?.data?.data?.subcategories || res?.data?.subcategories || res?.data || [];

            setCategoryRows(prevRows =>
                prevRows.map(row =>
                    row.id === rowId
                        ? {
                            ...row,
                            subCategories: Array.isArray(list) ? list : [],
                            loadingSub: false
                        }
                        : row
                )
            );
        } catch (err) {
            console.error(err);
            error_toaster("Failed to load subcategories");

            setCategoryRows(prevRows =>
                prevRows.map(row =>
                    row.id === rowId
                        ? { ...row, loadingSub: false }
                        : row
                )
            );
        }
    };

    const loadNewsForSubcategory = async (rowId, subCategoryId) => {
        if (!subCategoryId) return;
        try {
            setCategoryRows(prevRows =>
                prevRows.map(row =>
                    row.id === rowId
                        ? { ...row, loadingNews: true }
                        : row
                )
            );

            const res = await PostApi(API.getSubcategoryNews, { subCategoryId: Number(subCategoryId) });
            const list = res?.data?.data?.news || res?.data?.news || res?.data || [];

            setCategoryRows(prevRows =>
                prevRows.map(row =>
                    row.id === rowId
                        ? {
                            ...row,
                            news: Array.isArray(list) ? list : [],
                            loadingNews: false
                        }
                        : row
                )
            );
        } catch (err) {
            console.error(err);
            error_toaster("Failed to load news for this subcategory");

            setCategoryRows(prevRows =>
                prevRows.map(row =>
                    row.id === rowId
                        ? { ...row, loadingNews: false }
                        : row
                )
            );
        }
    };

    const handleSubCategoryChange = async (rowId, e) => {
        const id = e.target.value;

        setCategoryRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        subCategoryId: id,
                        news: [],
                        selectedOptions: []
                    }
                    : row
            )
        );

        await loadNewsForSubcategory(rowId, id);
    };

    const handleNewsSelection = (rowId, selectedOptions) => {
        // Limit selection to 10 items
        if (selectedOptions.length > LIMIT) {
            error_toaster(`You can select up to ${LIMIT} items per category.`);
            return;
        }

        setCategoryRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? { ...row, selectedOptions }
                    : row
            )
        );
    };

    const selectAllUpToLimit = (rowId) => {
        setCategoryRows(prevRows =>
            prevRows.map(row => {
                if (row.id !== rowId || !Array.isArray(row.news) || row.news.length === 0) return row;

                const options = row.news
                    .slice(0, LIMIT)
                    .map(news => ({
                        value: news.id,
                        label: news.title || "Untitled"
                    }));

                return {
                    ...row,
                    selectedOptions: options
                };
            })
        );
    };

    const clearAll = (rowId) => {
        setCategoryRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? { ...row, selectedOptions: [] }
                    : row
            )
        );
    };

    const addNewCategoryRow = () => {
        setCategoryRows(prev => [...prev, {
            id: Date.now(),
            categoryId: "",
            subCategoryId: "",
            subCategories: [],
            news: [],
            selectedOptions: [],
            loadingSub: false,
            loadingNews: false
        }]);
    };

    const removeCategoryRow = (rowId) => {
        if (categoryRows.length <= 1) return;
        setCategoryRows(prev => prev.filter(row => row.id !== rowId));
    };

    const handleSubmit = async () => {
        const payload = {};
        let hasErrors = false;

        for (const row of categoryRows) {
            if (row.categoryId && row.subCategoryId) {
                if (row.selectedOptions.length === 0) {
                    error_toaster(`Please select at least one news item for category ${row.categoryId}`);
                    hasErrors = true;
                    continue;
                }

                // Extract just the IDs from the selected options
                payload[row.categoryId] = row.selectedOptions.map(option => option.value);
            }
        }

        if (hasErrors) return;

        if (Object.keys(payload).length === 0) {
            error_toaster("Please select at least one category and subcategory");
            return;
        }

        try {
            setLoading(true);
            const res = await PostApi(API.saveTrending, payload);
            if (res?.data?.status === "1") {
                reFetch();
                setCategoryRows([{
                    id: 1,
                    categoryId: "",
                    subCategoryId: "",
                    subCategories: [],
                    news: [],
                    selectedOptions: [],
                    loadingSub: false,
                    loadingNews: false
                }])

                success_toaster(res?.data?.message || "Trending news updated");
            } else {
                error_toaster(res?.data?.message || "Saving failed");
            }
        } catch (err) {
            console.error(err);
            error_toaster("Network or server error while saving");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex p-5">
                <Sidebar />
                <div className="page-wrapper" style={{ width: "100%" }}>
                    <div className="content">
                        <div className="page-header">
                            <div className="page-title">
                                <h4>Category Trending News</h4>
                                <h6>Select up to 10 news items per category</h6>
                            </div>
                        </div>

                        {categoryRows.map((row) => (
                            <div key={row.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>Category Configuration</h5>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeCategoryRow(row.id)}
                                            disabled={categoryRows.length <= 1}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-5">
                                            <label className="form-label">Category</label>
                                            <select
                                                className="form-select"
                                                value={row.categoryId}
                                                disabled={catsLoading}
                                                onChange={(e) => handleCategoryChange(row.id, e)}
                                            >
                                                <option value="">Select category…</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name} {c.status === false ? "(inactive)" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                            {row.loadingSub && <div className="form-text">Loading subcategories…</div>}
                                        </div>

                                        <div className="col-12 col-md-5">
                                            <label className="form-label">Subcategory</label>
                                            <select
                                                className="form-select"
                                                value={row.subCategoryId}
                                                disabled={!row.categoryId || row.loadingSub}
                                                onChange={(e) => handleSubCategoryChange(row.id, e)}
                                            >
                                                <option value="">Select subcategory…</option>
                                                {row.subCategories.map((sc) => (
                                                    <option key={sc.id} value={sc.id}>
                                                        {sc.name || sc.title || sc.subCategoryName || `#${sc.id}`}
                                                    </option>
                                                ))}
                                            </select>
                                            {row.loadingNews && <div className="form-text">Loading news…</div>}
                                        </div>

                                        <div className="col-12 col-md-2">
                                            <label className="form-label">Actions</label>
                                            <div>
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={addNewCategoryRow}
                                                >
                                                    Add Another
                                                </button>
                                            </div>
                                        </div>

                                        {row.news.length > 0 && (
                                            <div className="col-12">
                                                <hr />
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <div className="small">
                                                        Selected: <strong>{row.selectedOptions.length}</strong> / {LIMIT}
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => selectAllUpToLimit(row.id)}
                                                        >
                                                            Select First {LIMIT}
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => clearAll(row.id)}
                                                            disabled={row.selectedOptions.length === 0}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>

                                                <Select
                                                    isMulti
                                                    options={row.news.map(news => ({
                                                        value: news.id,
                                                        label: news.title || "Untitled"
                                                    }))}
                                                    value={row.selectedOptions}
                                                    onChange={(selected) => handleNewsSelection(row.id, selected)}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    placeholder="Select news items..."
                                                    isDisabled={row.loadingNews}
                                                    closeMenuOnSelect={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-end">
                                    <button
                                        className="btn btn-success"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader /> : "Save All Trending News"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-3 mt-2">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h5 className="mb-0">Current Trending Articles</h5>
                                </div>

                                {trending.length === 0 ? (
                                    <div className="text-muted">No trending news configured.</div>
                                ) : (
                                    <div className="list-group">
                                        {trending.map((t, i) => (
                                            <div key={t.id} className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="me-3">
                                                        <div className="fw-semibold d-flex align-items-center gap-2">
                                                            <span className="badge bg-secondary">{i + 1}</span>
                                                            {t.title}
                                                        </div>
                                                        <div className="text-muted small">
                                                            ID: {t.id} · Category: {t.categoryId}
                                                            {t.createdAt && (
                                                                <> · {new Date(t.createdAt).toLocaleString()}</>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
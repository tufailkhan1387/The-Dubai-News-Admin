import React, { useEffect, useMemo, useState } from "react";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Sidebar from "../components/Sidebar";
import Select from "react-select";

const API = {
    getPinnedForSubcategory: "/admin/getCategoryMain",
    savePinnedForSubcategory: "/admin/setCategoryMain",
    getSubcategories: "/admin/getCategorySubcategories",
    getSubcategoryNews: "/admin/getSubcategoryNews",
};

export default function CategoryMainSettings() {
    const { apiData: catsRes, loading: catsLoading } = useFetch("/admin/getAllCategories");
    const { apiData: mainData, reFetch } = useFetch(API.getPinnedForSubcategory);
    const categories = useMemo(() => Array.isArray(catsRes?.data?.categories) ? catsRes.data.categories : [], [catsRes]);

    const picksByKey = useMemo(() => {
        const arr = mainData?.data?.newsData || [];
        const map = {};

        arr.forEach((row) => {
            const categoryId = row?.categoryId;
            if (!map[categoryId]) map[categoryId] = {};
            const key = row?.key;
            if (key && ['first', 'second', 'third', 'fourth'].includes(key)) {
                map[categoryId][key] = {
                    id: row?.newsId ?? null,
                    title: row?.news?.title ?? "(no title)",
                    raw: row,
                };
            }
        });

        return map;
    }, [mainData]);

    const [categoryRows, setCategoryRows] = useState([{
        id: 1,
        categoryId: "",
        subCategoryId: "",
        subCategories: [],
        news: [],
        slots: { first: null, second: null, third: null, fourth: null }
    }]);

    const handleCategoryChange = async (rowId, e) => {
        const id = e.target.value;

        // First update the row with the new category and reset other fields
        setCategoryRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        categoryId: id,
                        subCategoryId: "",
                        subCategories: [],
                        news: [],
                        slots: { first: null, second: null, third: null, fourth: null },
                        loadingSub: true
                    }
                    : row
            )
        );

        if (!id) return;

        try {
            const res = await PostApi(API.getSubcategories, { categoryId: Number(id) });
            const list = res?.data?.data?.subcategories || res?.data?.subcategories || res?.data || [];

            // Use functional update to ensure we're working with the latest state
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

            // Use functional update to ensure we're working with the latest state
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
            const updatedRows = categoryRows.map(row => {
                if (row.id === rowId) {
                    return { ...row, loadingNews: true };
                }
                return row;
            });
            setCategoryRows(updatedRows);

            const res = await PostApi(API.getSubcategoryNews, { subCategoryId: Number(subCategoryId) });
            const list = res?.data?.data?.news || res?.data?.news || res?.data || [];

            const newRows = categoryRows.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        news: Array.isArray(list) ? list : [],
                        loadingNews: false
                    };
                }
                return row;
            });
            setCategoryRows(newRows);
        } catch (err) {
            console.error(err);
            error_toaster("Failed to load news for this subcategory");
            const newRows = categoryRows.map(row => {
                if (row.id === rowId) {
                    return { ...row, loadingNews: false };
                }
                return row;
            });
            setCategoryRows(newRows);
        }
    };

    const handleSubCategoryChange = async (rowId, e) => {
        const id = e.target.value;
        const updatedRows = categoryRows.map(row => {
            if (row.id === rowId) {
                return {
                    ...row,
                    subCategoryId: id,
                    news: [],
                    slots: { first: null, second: null, third: null, fourth: null }
                };
            }
            return row;
        });
        setCategoryRows(updatedRows);
        await loadNewsForSubcategory(rowId, id);
    };

    const handlePick = (rowId, slot, selectedOption) => {
        const updatedRows = categoryRows.map(row => {
            if (row.id === rowId) {
                const updatedSlots = { ...row.slots, [slot]: selectedOption?.value || null };
                // Ensure no duplicate news picks
                Object.keys(updatedSlots).forEach(s => {
                    if (s !== slot && updatedSlots[s] === updatedSlots[slot]) {
                        updatedSlots[s] = null;
                    }
                });
                return { ...row, slots: updatedSlots };
            }
            return row;
        });
        setCategoryRows(updatedRows);
    };

    const addNewCategoryRow = () => {
        setCategoryRows(prev => [...prev, {
            id: Date.now(),
            categoryId: "",
            subCategoryId: "",
            subCategories: [],
            news: [],
            slots: { first: null, second: null, third: null, fourth: null }
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
        if (row.categoryId ) {
            // Check if all slots are filled
            const allSlotsFilled = Object.values(row.slots).every(slot => slot !== null);
            if (!allSlotsFilled) {
                error_toaster(`Please select all 4 news for category ${row.categoryId}`);
                hasErrors = true;
                continue; // Skip this row but continue with others
            }
            payload[row.categoryId] = { ...row.slots };
        }
    }

    if (hasErrors) {
        return; // Don't submit if any row has errors
    }

    if (Object.keys(payload).length === 0) {
        error_toaster("Please select at least one category and subcategory");
        return;
    }

    console.log("Final payload:", payload);

    try {
        const res = await PostApi(API.savePinnedForSubcategory, payload);
        if (res?.data?.status === "1") {
            reFetch();
            success_toaster(res?.data?.message || "Main section updated");
        } else {
            error_toaster(res?.data?.message || "Saving failed");
        }
    } catch (err) {
        console.error(err);
        error_toaster("Network or server error while saving");
    }
};
    console.log(categoryRows)
    return (
        <div className="d-flex p-5">
            <Sidebar />
            <div className="page-wrapper" style={{ width: "100%" }}>
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Category Main Settings</h4>
                            <h6>Pick 4 news for the Main Section of each Category</h6>
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
                                            <h6>Select 4 News for this Category</h6>
                                            <div className="row g-3">
                                                {['first', 'second', 'third', 'fourth'].map(slot => (
                                                    <div key={slot} className="col-12 col-md-6 col-lg-3">
                                                        <label className="form-label">{slot.charAt(0).toUpperCase() + slot.slice(1)}</label>
                                                        <Select
                                                            options={row.news.map(n => ({
                                                                value: n.id,
                                                                label: n.title || "Untitled",
                                                            }))}
                                                            value={row.news.find(n => n.id === row.slots[slot]) ? {
                                                                value: row.slots[slot],
                                                                label: row.news.find(n => n.id === row.slots[slot])?.title || "Untitled"
                                                            } : null}
                                                            onChange={(option) => handlePick(row.id, slot, option)}
                                                            isClearable
                                                        />
                                                    </div>
                                                ))}
                                            </div>
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
                                >
                                    Submit All Category Picks
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
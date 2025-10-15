import React, { useMemo, useState } from "react";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Sidebar from "../components/Sidebar";

export default function TopPicks() {
    // 1) Load categories
    const { apiData, loading: catsLoading } = useFetch("/admin/getAllCategories");
    const {
        apiData: topPicksRes,
        loading: topPicksLoading,
        reFetch: reFetchTopPicks,
    } = useFetch("/admin/getTopPicks");

    const topPicksArticles = useMemo(() => {
        const arr = topPicksRes?.data?.articles || [];
        return Array.isArray(arr) ? arr : [];
    }, [topPicksRes]);

    const LABELS = {
        topPicks: "Top Picks",
        foodies: "Foodies",
        eyeout: "Eye Out",
        budget: "Budget",
    };

    const groupedTopPicks = useMemo(() => {
        const g = { topPicks: [], foodies: [], eyeout: [], budget: [] };
        topPicksArticles.forEach((a) => {
            if (g[a.key]) g[a.key].push(a);
        });
        return g;
    }, [topPicksArticles]);
    // 2) Normalize categories
    const categories = useMemo(() => {
        const arr = apiData?.data?.categories || [];
        return Array.isArray(arr) ? arr : [];
    }, [apiData]);

    // 3) UI state (filters)
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [subLoading, setSubLoading] = useState(false);

    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    // 4) Curated lists (<= 7 items each)
    // 👉 If you need a 5th list, just add a key here (and it will auto-render).
    const LIST_KEYS = [
        { key: "topPicks", label: "Top Picks" },
        { key: "foodies", label: "Foodies" },
        { key: "eyeout", label: "Eye Out" },
        { key: "budget", label: "Budget" },
        // { key: "yourFifthList", label: "Your Fifth List" }, // ← add if needed
    ];

    const [lists, setLists] = useState(() => {
        const base = {};
        LIST_KEYS.forEach(({ key }) => (base[key] = []));
        return base; // { topPicks: [], foodies: [], eyeout: [], budget: [] }
    });

    // --- Helpers --------------------------------------------------------------

    const upsertList = (listKey, id) => {
        setLists((prev) => {
            const existing = new Set(prev[listKey] || []);
            if (existing.has(id)) {
                // remove
                existing.delete(id);
            } else {
                if (existing.size >= 7) {
                    error_toaster(`${listKey} already has 7 items`);
                    return prev;
                }
                existing.add(id);
            }
            return { ...prev, [listKey]: Array.from(existing) };
        });
    };

    const clearList = (listKey) => {
        setLists((prev) => ({ ...prev, [listKey]: [] }));
    };

    const isChecked = (listKey, id) => {
        return (lists[listKey] || []).includes(id);
    };

    const listCount = (listKey) => (lists[listKey] || []).length;

    const listIsFull = (listKey) => listCount(listKey) >= 7;

    // --- Fetch subcategories for selected category ---------------------------

    const handleCategoryChange = async (e) => {
        const id = e.target.value;
        setCategoryId(id);
        setSubCategoryId("");
        setNews([]);

        if (!id) {
            setSubCategories([]);
            return;
        }

        try {
            setSubLoading(true);
            const res = await PostApi("/admin/getCategorySubcategories", {
                categoryId: Number(id),
            });
            const list =
                res?.data?.data?.subcategories ||
                res?.data?.subcategories ||
                res?.data ||
                [];
            setSubCategories(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(err);
            setSubCategories([]);
            error_toaster("Failed to load subcategories");
        } finally {
            setSubLoading(false);
        }
    };

    // --- Fetch news for selected subcategory ---------------------------------

    const handleSubCategoryChange = async (e) => {
        const id = e.target.value;
        setSubCategoryId(id);
        setNews([]);

        if (!id) return;

        try {
            setNewsLoading(true);
            const res = await PostApi("/admin/getSubcategoryNews", {
                subCategoryId: Number(id),
            });
            const list = res?.data?.data?.news || res?.data?.news || res?.data || [];
            setNews(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(err);
            setNews([]);
            error_toaster("Failed to load news for this subcategory");
        } finally {
            setNewsLoading(false);
        }
    };

    // --- Submit ---------------------------------------------------------------

    const handleSubmitTopPicks = async () => {
        // 1) Validate: every list must have exactly 7 items
        const shortages = LIST_KEYS
            .map(({ key, label }) => {
                const count = (lists[key] || []).length;
                return count < 7 ? { key, label, need: 7 - count } : null;
            })
            .filter(Boolean);

        // if (shortages.length) {
        //     const msg =
        //         "Please complete your selections: " +
        //         shortages.map(s => `${s.label} (need ${s.need})`).join(", ") +
        //         ". Each list must have 7 items.";
        //     error_toaster(msg);
        //     return;
        // }

        // 2) Build payload
        const payload = LIST_KEYS.reduce((acc, { key }) => {
            acc[key] = (lists[key] || []).map(Number); // ensure numeric IDs
            return acc;
        }, {});
        console.log(payload)
        // 3) Submit
        try {
            const res = await PostApi("/admin/addTopPicks", payload);
            if (res?.data?.status === "1") {
                reFetchTopPicks();
                success_toaster(res?.data?.message || "Top picks saved");
            } else {
                error_toaster(res?.data?.message || "Failed to save top picks");
            }
        } catch (e) {
            console.error(e);
            error_toaster("Something went wrong");
        }
    };


    // --- UI -------------------------------------------------------------------

    return (
        <div className="d-flex p-5">
            <Sidebar />
            <div className="page-wrapper" style={{ width: "100%" }}>
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h4 className="mb-1">Top Picks</h4>
                        <small className="text-muted">
                            Select a category → subcategory → pick news into each list (up to 7 per list), then submit.
                        </small>
                    </div>
                </div>
                {/* Current Top Picks (from /admin/getTopPicks) */}
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0">Current Top Picks</h5>
                            {topPicksLoading && <span className="text-muted small">Loading…</span>}
                        </div>

                        <div className="row g-3">
                            {Object.keys(groupedTopPicks).map((key) => {
                                const list = groupedTopPicks[key] || [];
                                return (
                                    <div className="col-12 col-md-6 col-xl-3" key={key}>
                                        <div className="border rounded-3 p-3 h-100">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="badge bg-primary">{LABELS[key] || key}</span>
                                                <span className={`badge ${list.length >= 7 ? "bg-success" : "bg-secondary"}`}>
                                                    {list.length}/7
                                                </span>
                                            </div>

                                            {list.length === 0 ? (
                                                <div className="mt-2 small text-muted">No items yet.</div>
                                            ) : (
                                                <ul className="mt-2 mb-0 small" style={{ maxHeight: 220, overflowY: "auto" }}>
                                                    {list.map((item) => (
                                                        <li key={item.id} className="mb-1 border p-2">
                                                            {/* <span className="text-muted">#{item.newsId}</span>{" "} */}
                                                            {item.news?.title || "(no title)"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={categoryId}
                                    disabled={catsLoading}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select category…</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.status === false ? "(inactive)" : ""}
                                        </option>
                                    ))}
                                </select>
                                {catsLoading && (
                                    <div className="form-text">Loading categories…</div>
                                )}
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Subcategory</label>
                                <select
                                    className="form-select"
                                    value={subCategoryId}
                                    disabled={!categoryId || subLoading}
                                    onChange={handleSubCategoryChange}
                                >
                                    <option value="">Select subcategory…</option>
                                    {subCategories.map((sc) => (
                                        <option key={sc.id} value={sc.id}>
                                            {sc.name || sc.title || sc.subCategoryName || `#${sc.id}`}
                                        </option>
                                    ))}
                                </select>
                                {subLoading && (
                                    <div className="form-text">Loading subcategories…</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lists summary */}
                <div className="card mb-3">
                    <div className="card-body">
                        <h6 className="mb-3">Lists Overview</h6>
                        <div className="row g-3">
                            {LIST_KEYS.map(({ key, label }) => (
                                <div className="col-12 col-md-6 col-xl-3" key={key}>
                                    <div className="border rounded-3 p-3 h-100">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="badge bg-primary">{label}</span>
                                            <span className={`badge ${listIsFull(key) ? "bg-danger" : "bg-secondary"}`}>
                                                {listCount(key)}/7
                                            </span>
                                        </div>

                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => clearList(key)}
                                            >
                                                Clear {label}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* News list */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0">News</h5>
                            {newsLoading && <span className="text-muted small">Loading…</span>}
                        </div>

                        {(!news || news.length === 0) && !newsLoading ? (
                            <div className="text-muted">No news to display.</div>
                        ) : (
                            <div className="list-group">
                                {news.map((n) => {
                                    const id = n.id;
                                    const created =
                                        (n.createdAt && new Date(n.createdAt).toLocaleString()) ||
                                        (n.publishedAt && new Date(n.publishedAt).toLocaleString()) ||
                                        "";

                                    return (
                                        <div key={id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="me-3">
                                                    <div className="fw-semibold">{n.title || n.headline || "Untitled"}</div>
                                                    <div className="text-muted small">{created}</div>
                                                    {n.summary && (
                                                        <div className="small mt-1 text-secondary">{n.summary}</div>
                                                    )}
                                                </div>

                                                {/* Checkboxes per list */}
                                                <div className="d-flex align-items-center flex-wrap gap-3">
                                                    {LIST_KEYS.map(({ key, label }) => {
                                                        const checked = isChecked(key, id);
                                                        const disableBecauseFull = !checked && listIsFull(key);
                                                        return (
                                                            <label
                                                                key={`${key}-${id}`}
                                                                className="form-check-label d-flex align-items-center gap-2"
                                                                style={{ minWidth: 140 }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={checked}
                                                                    disabled={disableBecauseFull}
                                                                    onChange={() => upsertList(key, id)}
                                                                />
                                                                <span>
                                                                    {label}{" "}
                                                                    <span className="text-muted small">
                                                                        ({listCount(key)}/7)
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-success" onClick={handleSubmitTopPicks}>
                                Submit Top Picks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

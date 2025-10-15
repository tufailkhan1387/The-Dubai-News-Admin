import React, { useEffect, useMemo, useState } from "react";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Sidebar from "../components/Sidebar";

export default function TrendingArticles() {
    // Load categories
    const { apiData, loading: catsLoading } = useFetch("/admin/getAllCategories");
    // (Optional) load existing trending config to prefill
    const {
        apiData: trendRes,
        loading: trendLoading,
        reFetch: reFetchTrending,
    } = useFetch("/admin/getTrendingArticles");
    console.log(trendRes?.data?.articles)
    // Normalize categories
    const categories = useMemo(() => {
        const arr = apiData?.data?.categories || [];
        return Array.isArray(arr) ? arr : [];
    }, [apiData]);

    // UI state
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [subLoading, setSubLoading] = useState(false);

    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    // Selections: all single-select (leftSide is single now)
    const [slots, setSlots] = useState({
        main: null,
        left: null,
        right: null,
        leftSide: null,
    });

   

     const pinned = useMemo(() => {
            const list = trendRes?.data?.articles || [];
            const map = {};
            list.forEach(a => {
                map[a.key] = {
                    newsId: a.newsId,
                    title: a.news?.title || "(no title)",
                };
            });
            return map; // { main: {newsId, title}, left: {...}, right: {...} }
        }, [trendRes]);

    // Category change → load subcategories
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

    // Subcategory change → load news
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

    // Pick a single slot (mutually exclusive across all slots)
    const pickSingle = (slot, id) => {
        setSlots((prev) => {
            const next = { ...prev, [slot]: id };
            ["main", "left", "right", "leftSide"].forEach((s) => {
                if (s !== slot && next[s] === id) next[s] = null;
            });
            return next;
        });
    };

    const unassignAllForId = (id) => {
        setSlots((prev) => ({
            ...prev,
            main: prev.main === id ? null : prev.main,
            left: prev.left === id ? null : prev.left,
            right: prev.right === id ? null : prev.right,
            leftSide: prev.leftSide === id ? null : prev.leftSide,
        }));
    };

    const handleSubmitTrending = async () => {
        const payload = {
            main: slots.main,
            left: slots.left,
            right: slots.right,
            leftSide: slots.leftSide, // single ID or null
        };

        try {
            const res = await PostApi("/admin/trendingArticlesNews", payload);
            if (res?.data?.status === "1") {
                success_toaster(res.data.message || "Trending updated");
                reFetchTrending?.();
            } else {
                error_toaster(res?.data?.message || "Update failed");
            }
        } catch (e) {
            console.error(e);
            error_toaster("Something went wrong");
        }
    };

    return (
        <div className="d-flex p-5">
            <Sidebar />
            <div className="page-wrapper" style={{ width: "100%" }}>
                {/* Current selections summary */}
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0">Trending Articles</h5>
                            {trendLoading && <span className="text-muted small">Loading…</span>}
                        </div>

                          <div className="row g-3">
                            {["main", "left", "right","leftSide"].map((slot) => (
                                <div className="col-12 col-md-6" key={slot}>
                                    <div className="border rounded-3 p-3 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span className="badge bg-primary text-uppercase">{slot}</span>
                                            {pinned[slot]?.newsId && (
                                                <span className="text-muted small">ID: {pinned[slot].newsId}</span>
                                            )}
                                        </div>
                                        <div className="fw-semibold">
                                            {pinned[slot]?.title || <span className="text-muted">Not set</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h4 className="mb-1">Pick Trending Articles</h4>
                        <small className="text-muted">
                            Choose category → subcategory → assign slots.
                        </small>
                    </div>
                </div>

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

                {/* News list with slot pickers */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0">News</h5>
                            {newsLoading && <span className="text-muted small">Loading…</span>}
                        </div>

                        {/* Quick summary */}
                        <div className="mb-3 small">
                            <span className="me-3">
                                <strong>Main:</strong> {slots.main ?? "—"}
                            </span>
                            <span className="me-3">
                                <strong>Left:</strong> {slots.left ?? "—"}
                            </span>
                            <span className="me-3">
                                <strong>Right:</strong> {slots.right ?? "—"}
                            </span>
                            <span>
                                <strong>LeftSide:</strong> {slots.leftSide ?? "—"}
                            </span>
                        </div>

                        {(!news || news.length === 0) && !newsLoading ? (
                            <div className="text-muted">No news to display.</div>
                        ) : (
                            <div className="list-group">
                                {news.map((n) => {
                                    const id = n.id;
                                    const pickedAs =
                                        slots.main === id
                                            ? "Main"
                                            : slots.left === id
                                                ? "Left"
                                                : slots.right === id
                                                    ? "Right"
                                                    : slots.leftSide === id
                                                        ? "LeftSide"
                                                        : null;

                                    return (
                                        <div key={id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="me-3">
                                                    <div className="fw-semibold d-flex align-items-center gap-2">
                                                        {n.title || n.headline || "Untitled"}
                                                        {pickedAs && (
                                                            <span
                                                                className={`badge ${pickedAs === "LeftSide"
                                                                    ? "bg-success"
                                                                    : "bg-primary"
                                                                    }`}
                                                            >
                                                                {pickedAs}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {(n.createdAt &&
                                                            new Date(n.createdAt).toLocaleString()) ||
                                                            (n.publishedAt &&
                                                                new Date(n.publishedAt).toLocaleString()) ||
                                                            ""}
                                                    </div>
                                                    {n.summary && (
                                                        <div className="small mt-1 text-secondary">
                                                            {n.summary}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        className="btn-group btn-group-sm"
                                                        role="group"
                                                        aria-label="Pick slot"
                                                    >
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.main === id
                                                                ? "btn-primary"
                                                                : "btn-outline-primary"
                                                                }`}
                                                            onClick={() => pickSingle("main", id)}
                                                        >
                                                            Main
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.left === id
                                                                ? "btn-primary"
                                                                : "btn-outline-primary"
                                                                }`}
                                                            onClick={() => pickSingle("left", id)}
                                                        >
                                                            Left
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.right === id
                                                                ? "btn-primary"
                                                                : "btn-outline-primary"
                                                                }`}
                                                            onClick={() => pickSingle("right", id)}
                                                        >
                                                            Right
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.leftSide === id
                                                                ? "btn-success"
                                                                : "btn-outline-success"
                                                                }`}
                                                            onClick={() => pickSingle("leftSide", id)}
                                                        >
                                                            LeftSide
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => unassignAllForId(id)}
                                                        >
                                                            None
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-success" onClick={handleSubmitTrending}>
                                Submit Trending
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

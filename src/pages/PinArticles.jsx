import React, { useEffect, useMemo, useState } from "react";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Sidebar from "../components/Sidebar";

export default function PinArticles() {
    // 1) Load all categories
    const { apiData: pinRes, loading: pinLoading, reFetch } = useFetch("/admin/getPinArticles");
    const pinned = useMemo(() => {
        const list = pinRes?.data?.articles || [];
        const map = {};
        list.forEach(a => {
            map[a.key] = {
                newsId: a.newsId,
                title: a.news?.title || "(no title)",
            };
        });
        return map; // { main: {newsId, title}, left: {...}, right: {...} }
    }, [pinRes]);
    const { apiData, loading: catsLoading } = useFetch("/admin/getAllCategories");

    // Local UI state
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");

    const [subCategories, setSubCategories] = useState([]);
    const [subLoading, setSubLoading] = useState(false);
    const [slots, setSlots] = useState({ main: null, left: null, right: null });

    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    // Normalize categories from your provided payload shape
    const categories = useMemo(() => {
        const arr = apiData?.data?.categories || [];
        return Array.isArray(arr) ? arr : [];
    }, [apiData]);

    // 2) Fetch subcategories when category changes
    const handleCategoryChange = async (e) => {
        const id = e.target.value;
        setCategoryId(id);
        setSubCategoryId("");
        setNews([]); // reset news

        if (!id) {
            setSubCategories([]);
            return;
        }

        try {
            setSubLoading(true);
            const res = await PostApi("/admin/getCategorySubcategories", { categoryId: Number(id) });
            // Expecting something like { status: "1", data: { subcategories: [...] } }
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

    // 3) Fetch news when subcategory changes
    const handleSubCategoryChange = async (e) => {
        const id = e.target.value;
        setSubCategoryId(id);
        setNews([]);

        if (!id) return;

        try {
            setNewsLoading(true);
            const res = await PostApi("/admin/getSubcategoryNews", { subCategoryId: Number(id) });
            // Expecting something like { status: "1", data: { news: [...] } }
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

    const handlePick = (slot, id) => {
        setSlots(prev => {
            // ensure a news item can only live in ONE slot
            const next = { ...prev, [slot]: id };
            Object.keys(prev).forEach(s => {
                if (s !== slot && prev[s] === id) next[s] = null;
            });
            return next;
        });
    };
    const unassign = (id) => {
        setSlots(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(s => { if (next[s] === id) next[s] = null; });
            return next;
        });
    };

    const handleSubmitSlots = async () => {
        const payload = { main: slots.main, left: slots.left, right: slots.right };
        console.log("Selected slots:", payload);
        const res = await PostApi("/admin/pinArticles", payload);
        if (res?.data?.status === "1") {
            reFetch();
            success_toaster(res.data.message);


        } else {
            error_toaster(res?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="d-flex p-5">
            <Sidebar />
            <div className="page-wrapper" style={{ width: "100%" }}>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <h5 className="mb-0">Pinned Articles</h5>
                            {pinLoading && <span className="text-muted small">Loading…</span>}
                        </div>

                        <div className="row g-3">
                            {["main", "left", "right"].map((slot) => (
                                <div className="col-12 col-md-4" key={slot}>
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

                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h4 className="mb-1">Pin Articles</h4>
                        <small className="text-muted">
                            Pick a category → subcategory to load its news.
                        </small>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Category Select */}
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
                                {catsLoading && <div className="form-text">Loading categories…</div>}
                            </div>

                            {/* Subcategory Select */}
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
                                {subLoading && <div className="form-text">Loading subcategories…</div>}
                            </div>
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

                        {/* Quick summary of selections */}
                        <div className="mb-3 small">
                            <span className="me-3">
                                <strong>Main:</strong> {slots.main ?? "—"}
                            </span>
                            <span className="me-3">
                                <strong>Left:</strong> {slots.left ?? "—"}
                            </span>
                            <span>
                                <strong>Right:</strong> {slots.right ?? "—"}
                            </span>
                        </div>

                        {(!news || news.length === 0) && !newsLoading ? (
                            <div className="text-muted">No news to display.</div>
                        ) : (
                            <div className="list-group">
                                {news.map((n) => {
                                    const id = n.id || n.slug; // adjust if your id is always n.id
                                    const pickedAs =
                                        slots.main === id ? "Main" :
                                            slots.left === id ? "Left" :
                                                slots.right === id ? "Right" : null;

                                    return (
                                        <div key={id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="me-3">
                                                    <div className="fw-semibold d-flex align-items-center gap-2">
                                                        {n.title || n.headline || "Untitled"}
                                                        {pickedAs && <span className="badge bg-primary">{pickedAs}</span>}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {(n.createdAt && new Date(n.createdAt).toLocaleString()) ||
                                                            (n.publishedAt && new Date(n.publishedAt).toLocaleString()) || ""}
                                                    </div>
                                                    {n.summary && (
                                                        <div className="small mt-1 text-secondary">{n.summary}</div>
                                                    )}
                                                </div>

                                                {/* Slot picker */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="btn-group btn-group-sm" role="group" aria-label="Pick slot">
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.main === id ? "btn-primary" : "btn-outline-primary"}`}
                                                            onClick={() => handlePick("main", id)}
                                                        >
                                                            Main
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.left === id ? "btn-primary" : "btn-outline-primary"}`}
                                                            onClick={() => handlePick("left", id)}
                                                        >
                                                            Left
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn ${slots.right === id ? "btn-primary" : "btn-outline-primary"}`}
                                                            onClick={() => handlePick("right", id)}
                                                        >
                                                            Right
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => unassign(id)}
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

                        {/* Submit selections */}
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-success" onClick={handleSubmitSlots}>
                                Submit Selections
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {/* Optional: debug */}
            {/* <pre className="mt-3 small text-muted">{JSON.stringify({ categoryId, subCategoryId }, null, 2)}</pre> */}
        </div>
    );
}

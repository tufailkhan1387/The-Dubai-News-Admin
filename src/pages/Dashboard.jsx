import React, { useMemo } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";

// ⬇️ Add Recharts
import {
  CartesianGrid,
  Cell, Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts";

export default function Dashboard() {
  const { apiData } = useFetch("/admin/dashboard");
  // console.log(JSON.stringify(apiData));

  const ok = apiData?.status === "1";
  const stats = ok ? apiData?.data : {};

  const totalArticles = stats?.aritcles ?? 0;          // note: "aritcles" in API
  const activeCategories = stats?.activeCategories ?? 0;
  const totalCities = stats?.cities ?? 0;
  const topNews = Array.isArray(stats?.topNews) ? stats.topNews : [];

  const statusBadgeClass = (s = "") => {
    const v = String(s).toLowerCase();
    if (v === "publish" || v === "published") return "badge badge-linesuccess";
    if (v === "draft") return "badge badge-linedanger";
    if (v === "preview") return "badge badge-linewarning";
    return "badge badge-linesecondary";
  };
  const statusLabel = (s = "") => (s?.trim() ? s : "—");

  // ---------- Charts data (dynamic from API) ----------
  // Helper: create a baseline for last N months so the line chart is stable even if months have 0
  const getLastNMonths = (n = 6) => {
    const arr = [];
    const d = new Date();
    d.setDate(1);
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const label = dt.toLocaleString(undefined, { month: "short" }) + " " + dt.getFullYear();
      arr.push({ key, label, value: 0 });
    }
    return arr;
  };

  // Line chart: monthly counts from createdAt (using topNews list)
  const lineData = useMemo(() => {
    const counts = new Map();
    topNews.forEach((n) => {
      const d = new Date(n?.createdAt);
      if (isNaN(d)) return;
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });

    const baseline = getLastNMonths(6);
    return baseline.map((m) => ({
      month: m.label,
      news: counts.get(m.key) ?? 0,
    }));
  }, [topNews]);

  // Pie chart: category distribution
  const pieData = useMemo(() => {
    const agg = new Map();
    topNews.forEach((n) => {
      const cat = n?.category?.name || "Unknown";
      agg.set(cat, (agg.get(cat) ?? 0) + 1);
    });
    if (agg.size === 0) return [{ category: "No Data", value: 0 }];
    return [...agg.entries()].map(([category, value]) => ({ category, value }));
  }, [topNews]);

  const PIE_COLORS = ["#8e44ad", "#e67e22", "#2ecc71", "#3498db", "#f39c12", "#1abc9c"];

  return (
    <div className="d-flex ">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          {/* Top Metric Cards */}
          <div className="row pt-3 mr-3">
            <Card count={String(totalArticles)} title="Total News Articles" iconClass="codepen" className="das" />
            <Card count={String(activeCategories)} title="Active Categories" iconClass="git-merge" className="das1" />
            <Card count={String(totalCities)} title="Managed Cities" iconClass="book-open" className="das3" />
            <Card count="05" title="Custom Pages" iconClass="edit" className="das4" />
          </div>

          {/* Charts Section */}
          <div className="row mt-4">
            {/* Line: News Publishing Trends */}
            <div className="col-xl-7 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="card-title">News Publishing Trends</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="news" stroke="#8e44ad" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pie: News by Category */}
            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="card-title">News by Category</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Top News Table */}
          <div className="card mt-4">
            <div className="card-header">
              <h4 className="card-title">Latest News</h4>
            </div>
            <div className="card-body">
              <div
                className="table-responsive dataview"
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table
                  className="table dashboard-expired-products"
                  style={{ minWidth: "900px" }}
                >
                  <thead>
                    <tr>
                      <th>No</th>
                      <th style={{ minWidth: "250px" }}>Title</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>City</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topNews.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          No data
                        </td>
                      </tr>
                    ) : (
                      topNews.map((n, idx) => (
                        <tr key={n.id}>
                          <td>{String(idx + 1).padStart(2, "0")}</td>
                          <td
                            className="d-flex align-items-center gap-2"
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            {n.thumbnail ? (
                              <img
                                src={n.thumbnail}
                                alt="thumb"
                                width="36"
                                height="36"
                                style={{ objectFit: "cover", borderRadius: "6px" }}
                              />
                            ) : null}
                            <a href="#">{n.title || "-"}</a>
                          </td>
                          <td>{n?.category?.name ?? "-"}</td>
                          <td>{n?.subCategory?.name ?? "-"}</td>
                          <td>{n?.city?.name ?? "-"}</td>
                          <td>
                            <span className={statusBadgeClass(n.status)}>
                              {statusLabel(n.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
}

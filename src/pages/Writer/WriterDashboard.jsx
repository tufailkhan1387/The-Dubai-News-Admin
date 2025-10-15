import React, { useMemo } from "react";
import { MdEdit, MdCheckCircle, MdPendingActions } from "react-icons/md";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import useFetch from "../../ApiClient/GetApi";

export default function WriterDashboard() {
  const { apiData } = useFetch("/admin/writerDashboard");

  // ---- Safe reads from API ----
  const approvedArticles = apiData?.data?.approvedArticles ?? [];
  const approvedCount    = approvedArticles.length;
  const pendingCount     = apiData?.data?.pendingArticles ?? 0;

  // Utility: build last N months baseline so the line stays consistent even with sparse data
  const getLastNMonths = (n = 6) => {
    const arr = [];
    const d = new Date();
    d.setDate(1); // normalize to first day
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const label =
        dt.toLocaleString(undefined, { month: "short" }) + " " + dt.getFullYear();
      arr.push({ key, label, news: 0 });
    }
    return arr;
  };

  // ---- Line chart data: monthly counts from createdAt ----
  const lineData = useMemo(() => {
    // Aggregate counts by YYYY-MM
    const counts = new Map();
    approvedArticles.forEach((art) => {
      const d = new Date(art?.createdAt);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    // Start with last 6 months baseline, then fill counts
    const baseline = getLastNMonths(6);
    const merged = baseline.map((m) => ({
      month: m.label,
      news: counts.get(m.key) ?? 0,
    }));

    // If you prefer “only months that exist in data”, uncomment this instead:
    // return [...counts.entries()]
    //   .sort(([a], [b]) => (a > b ? 1 : -1))
    //   .map(([key, value]) => {
    //     const [y, mm] = key.split("-");
    //     const dt = new Date(Number(y), Number(mm) - 1, 1);
    //     return {
    //       month: dt.toLocaleString(undefined, { month: "short" }) + " " + y,
    //       news: value,
    //     };
    //   });

    return merged;
  }, [approvedArticles]);

  // ---- Pie chart data: category-wise counts ----
  const pieData = useMemo(() => {
    const agg = new Map();
    approvedArticles.forEach((art) => {
      const name = art?.category?.name || "Unknown";
      agg.set(name, (agg.get(name) ?? 0) + 1);
    });
    // Fallback: if no data yet, show a single empty slice (optional)
    if (agg.size === 0) return [{ category: "No Data", value: 0 }];
    return [...agg.entries()].map(([category, value]) => ({ category, value }));
  }, [approvedArticles]);

  const COLORS = ["#8e44ad", "#e67e22", "#2ecc71", "#3498db", "#f39c12", "#1abc9c"];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          {/* ====== Top Welcome / Hero ====== */}
          <div className="row pt-3">
            <div className="col-xl-6 col-lg-6 col-md-12 mb-3">
              <div className="card" style={{
                background:"linear-gradient(90deg, rgba(121,0,84,1) 0%, rgba(214,28,111,1) 65%, rgba(238,113,164,1) 100%)",
                color:"#fff", border:"none",
              }}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-2" style={{ opacity: 0.9 }}>Welcome __</p>
                      <h2 className="mb-2 text-white" style={{ fontWeight: 800 }}>
                        Ready to tell the Next Big Story?
                      </h2>
                      <p className="mb-3" style={{ opacity: 0.9 }}>
                        Your insights shape the narrative of Dubai. Start writing your next article now.
                      </p>
                      <Link to="/writer-create-news" className="btn btn-light d-inline-flex align-items-center">
                        <span className="me-2"><MdEdit size={18} /></span>
                        Write a New Article
                      </Link>
                    </div>
                    <div style={{ width: 120 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Tiles (now dynamic) */}
            <div className="col-xl-6 col-lg-6 col-md-12 mb-3">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card" style={{
                    background:"linear-gradient(180deg, rgba(121,0,84,1) 0%, rgba(170,0,108,1) 100%)",
                    color:"#fff", border:"none",
                  }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center text-white justify-content-between">
                        <div>
                          <h3 className="mb-1 text-white" style={{ fontWeight: 800 }}>
                            {approvedCount}
                          </h3>
                          <div style={{ opacity: 0.9 }}>Approved Articles</div>
                        </div>
                        <MdCheckCircle size={44} style={{ opacity: 0.8 }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="card" style={{
                    background:"linear-gradient(180deg, rgba(238,113,164,1) 0%, rgba(255,182,206,1) 100%)",
                    color:"#4b0b3a", border:"none",
                  }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h3 className="mb-1 text-white" style={{ fontWeight: 800 }}>
                            {pendingCount}
                          </h3>
                          <div>Pending Articles</div>
                        </div>
                        <MdPendingActions size={44} style={{ opacity: 0.6 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====== Charts Row ====== */}
          <div className="row mt-2">
            {/* Line Graph (monthly from createdAt) */}
            <div className="col-xl-7 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="card-title">News Added per Month</div>
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

            {/* Pie Graph (category counts) */}
            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="card-title">News By Category</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

        </div>
      </div>
    </div>
  );
}

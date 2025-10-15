import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ReportManagement() {
  // Fetch categories & publishers
  const { apiData: categoriesRes } = useFetch("/admin/getAllCategories");
  const categories = useMemo(() => categoriesRes?.data?.categories ?? [], [categoriesRes]);

  const { apiData: publishersRes } = useFetch("/admin/getAllWriters");
  const publishers = useMemo(() => publishersRes?.data?.writers ?? [], [publishersRes]);

  // Subcategories for selected category
  const [subCategories, setSubCategories] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  // Filters (IDs or "All")
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    categoryId: "All",
    subCategoryId: "All",
    publisherId: "All",
  });

  // Report data state
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Helpers
  const toNumOrAll = (v) => (v === "All" ? "All" : Number(v));

  // Helper function to generate the last N months
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

  // Unified change handler (names match state keys)
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Date / Publisher / Subcategory trivial updates
    if (name === "startDate" || name === "endDate" || name === "publisherId" || name === "subCategoryId") {
      return setFilters((prev) => ({ ...prev, [name]: value }));
    }

    // Category update → fetch subcategories
    if (name === "categoryId") {
      const nextCategory = value;
      setFilters((prev) => ({ ...prev, categoryId: nextCategory, subCategoryId: "All" }));

      if (nextCategory === "All") {
        setSubCategories([]);
        return;
      }

      try {
        setSubLoading(true);
        const res = await PostApi("/admin/getCategorySubcategories", { categoryId: Number(nextCategory) }, true);
        setSubCategories(res?.data?.data?.subcategories || []);
      } catch (err) {
        console.error("Fetch subcategories error:", err);
        setSubCategories([]);
      } finally {
        setSubLoading(false);
      }
    }
  };

  // Submit
  const handleGenerate = async () => {
    const payload = {
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      categoryId: toNumOrAll(filters.categoryId),
      subCategoryId: toNumOrAll(filters.subCategoryId),
      publisherId: toNumOrAll(filters.publisherId),
    };

    try {
      setLoadingReport(true);
      const res = await PostApi("/admin/generateReport", payload, true);
      setReportData(res?.data?.data?.totalNews || []);
    } catch (err) {
      console.error("Generate report error:", err);
      setReportData([]);
    } finally {
      setLoadingReport(false);
    }
  };

  // Process totalNews for the chart (e.g., count or views over time)
  const chartData = {
    labels: [], // Default for now, will populate with months
    datasets: [
      {
        label: "News Count",
        data: [], // Will populate with news count
        borderColor: "#5d0033",
        backgroundColor: "rgba(93, 0, 51, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Process reportData for charting
  const processChartData = () => {
    const counts = new Map();
    const months = getLastNMonths(6); // You can change N here

    // Process news data by month
    reportData?.forEach((news) => {
      const d = new Date(news?.createdAt);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
    });

    // Fill chartData
    months.forEach((month) => {
      chartData.labels.push(month.label);
      chartData.datasets[0].data.push(counts.get(month.key) || 0);
    });
  };

  processChartData(); // Calling the function to process chart data

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>Report Management</h4>
              <h6>Manage your reports</h6>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                {/* Start Date */}
                <div className="col-md-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                  />
                </div>

                {/* End Date */}
                <div className="col-md-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Category (binds to categoryId) */}
                <div className="col-md-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleChange}
                  >
                    <option value="All">All</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category (binds to subCategoryId) */}
                <div className="col-md-3">
                  <label className="form-label">Sub Category</label>
                  <select
                    className="form-select"
                    name="subCategoryId"
                    value={filters.subCategoryId}
                    onChange={handleChange}
                    disabled={filters.categoryId === "All" || subLoading}
                  >
                    <option value="All">{subLoading ? "Loading..." : "All"}</option>
                    {subCategories.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Publisher (binds to publisherId) */}
                <div className="col-md-3">
                  <label className="form-label">Publisher</label>
                  <select
                    className="form-select"
                    name="publisherId"
                    value={filters.publisherId}
                    onChange={handleChange}
                  >
                    <option value="All">All</option>
                    {publishers.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <div className="col-12 col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleGenerate}
                    style={{ backgroundColor: "#5d0033", border: "none" }}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

         <div className="card mt-4">
  <div className="card-header">
    <h6 className="card-title">Total News</h6>
  </div>
  <div className="card-body">
    <div className="d-flex align-items-center justify-content-between">
      <h4>{reportData?.length || 0}</h4> {/* Display the total number of news articles */}
      <div>
        <span className="badge bg-primary">{reportData?.length > 0 ? "Active" : "No News"}</span>
      </div>
    </div>
  </div>
</div>

          {/* Chart */}
          {loadingReport ? (
            <div>Loading...</div>
          ) : reportData?.length > 0 ? (
            <div className="card mt-4">
              <div className="card-header">
                <h6>Report Overview</h6>
              </div>
              <div className="card-body">
                <Line data={chartData} />
              </div>
            </div>
          ) : (
            <div>No report data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

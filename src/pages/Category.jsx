import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";

export default function Category() {
  // force refetch by changing the query string
  const [refreshTick, setRefreshTick] = useState(0);

  const apiData = useFetch(`/admin/getAllCategories?t=${refreshTick}`);
  const getAllCities = useFetch("/admin/getAllCities");

  console.log(JSON.stringify(apiData))

  

  const [categoryData, setCategoryData] = useState([]);
  const [q, setQ] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", cityIds: [], color: "#5d0033" });
  // add near your other state:
const [loadingCityLinks, setLoadingCityLinks] = useState(false);


  // Delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  // cities list
  const cities =
    getAllCities?.apiData?.data?.cities ||
    getAllCities?.apiData?.data ||
    [];

  const getCityName = (id) =>
    cities.find((c) => String(c.id) === String(id))?.name || "-";

  const getCityNames = (ids = []) =>
    (ids || []).map((id) => getCityName(id)).filter(Boolean).join(", ");

 useEffect(() => {
  if (apiData?.apiData?.status === "1" && apiData?.apiData?.data?.categories) {
    const mapped = apiData.apiData.data.categories.map((item) => {
      // cityIds from junction table
      const linkedIds = Array.isArray(item.cityCategories)
        ? item.cityCategories.map((cc) => String(cc.cityId))
        : [];

      // legacy fallback (if any)
      const legacyId = item.cityId ? [String(item.cityId)] : [];

      const finalIds = linkedIds.length ? linkedIds : legacyId;

      // build display string using fetched cities list
      const cityDisplay =
        finalIds.length > 0
          ? finalIds
              .map((id) => cities.find((c) => String(c.id) === String(id))?.name || id)
              .join(", ")
          : "-";

      return {
        id: item.id,
        name: item.name,
        cityIds: finalIds,         // <- used by edit modal
        status: item.status ? "Active" : "Inactive",
        city: cityDisplay,         // <- shown in table
        color: item.color || "#5d0033"  // Add color to the mapped data
      };
    });

    setCategoryData(mapped);
  }
}, [apiData?.apiData, cities]);


  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus == "Active" ? false : true; // Toggle the status
    try {
      const res = await PostApi("/admin/changeStatusOfCategory", { id, status: newStatus });
      if (res?.data?.status === "1") {
        success_toaster(`Category status updated to ${newStatus ? "Active" : "Inactive"}`);
        apiData.reFetch();
      } else {
        error_toaster(res?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      error_toaster("Failed to update status");
    }
  };

  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categoryData;
    return categoryData.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.city?.toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term)
    );
  }, [categoryData, q]);

  const openAddModal = () => {
    setIsEdit(false);
    setEditId(null);
    setForm({ name: "", cityIds: [], color: "#5d0033" });
    setShowModal(true);
  };

// replace your openEditModal with this async version
const openEditModal = (row) => {
  setIsEdit(true);
  setEditId(row.id);
  setForm({
    name: row.name || "",
    cityIds: Array.isArray(row.cityIds) ? row.cityIds.map(String) : [],
    color: row.color || "#5d0033"
  });
  setShowModal(true);
};



  const openDeleteModal = (row) => {
    setDeleteId(row.id);
    setDeleteName(row.name || "");
    setShowDelete(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return error_toaster("Category name is required");
    const ids = (form.cityIds || []).map(String).filter(Boolean);
    if (!ids.length) return error_toaster("Please select at least one city");

    try {
      setSaving(true);

      if (isEdit && editId) {
        // UPDATE: send list of cityIds and color
        const res = await PostApi("/admin/updateCategory", {
          id: editId,
          name: form.name.trim(),
          cityIds: ids, // <-- list
          color: form.color
        });

        if (res?.data?.status === "1") {
          success_toaster("Category updated successfully");
          setShowModal(false);

          // Optimistic update
          setCategoryData((prev) =>
            prev.map((r) =>
              r.id === editId
                ? {
                    ...r,
                    name: form.name.trim(),
                    cityIds: ids,
                    city: getCityNames(ids),
                    color: form.color
                  }
                : r
            )
          );

          setRefreshTick(Date.now());
        } else {
          error_toaster(res?.data?.message || "Update failed");
        }
      } else {
        // CREATE: send list of cityIds and color
        const res = await PostApi("/admin/addCategory", {
          name: form.name.trim(),
          cityIds: ids, // <-- list
          color: form.color
        });

        if (res?.data?.status === "1") {
          success_toaster("Category added successfully");
          setShowModal(false);

          const created = res?.data?.data; // expecting { id, ... } (optional)
          const optimisticRow = {
            id: created?.id ?? Date.now(),
            name: form.name.trim(),
            cityIds: ids,
            city: getCityNames(ids),
            status: "Active",
            color: form.color
          };

          // Optimistic prepend
          setCategoryData((prev) => [optimisticRow, ...prev]);

          setRefreshTick(Date.now());
        } else {
          error_toaster(res?.data?.message || "Something went wrong");
        }
      }
    } catch (err) {
      console.error(err);
      error_toaster(isEdit ? "Failed to update category" : "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await PostApi("/admin/deleteCategory", { id: deleteId });

      if (res?.data?.status === "1") {
        success_toaster("Deleted successfully");
        setShowDelete(false);

        // Optimistic remove
        setCategoryData((prev) => prev.filter((r) => r.id !== deleteId));

        // Hard refresh
        setRefreshTick(Date.now());
      } else {
        error_toaster(res?.data?.message || "Delete failed");
      }
    } catch (e) {
      console.error(e);
      error_toaster("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      name: "No",
      selector: (_, index) => String(index + 1).padStart(2, "0"),
      width: "80px",
    },
    { name: "Category", selector: (row) => row.name, sortable: true },
    { name: "Cities", selector: (row) => row.city, sortable: true },
    {
      name: "Color",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: row.color,
              borderRadius: "50%",
              marginRight: "8px",
              border: "1px solid #ddd"
            }}
          ></div>
          <span>{row.color}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          className={`badge ${row.status == "Active" ? "bg-success" : "bg-danger"}`}
          style={{ borderRadius: "10px", padding: "3px 10px", fontSize: "12px" }}
          onClick={() => toggleStatus(row.id, row.status)}
        >
          {row.status}
        </button>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => openEditModal(row)}
          >
            <MdEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => openDeleteModal(row)}
          >
            <MdDelete />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "160px",
    },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>Category</h4>
              <h6>Manage your categories</h6>
            </div>
            <div className="page-btn">
              <button className="btn btn-primary" onClick={openAddModal}>
                <i className="me-2">+</i> Add New
              </button>
            </div>
          </div>

          <div className="card table-list-card">
            <div className="card-body p-3">
              <div className="table-top mb-3 d-flex justify-content-between">
                <div className="search-set">
                  <input
                    type="text"
                    placeholder="Search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "250px" }}
                  />
                </div>
              </div>

              <div style={{ overflowX: "auto", minWidth: "100%" }}>
                <DataTable
                  columns={columns}
                  data={filteredRows}
                  pagination
                  highlightOnHover
                  striped
                  progressPending={apiData?.loading}
                  customStyles={{
                    headCells: {
                      style: {
                        backgroundColor: "#5d0033",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                      },
                    },
                    rows: { style: { fontSize: "14px" } },
                    pagination: {
                      style: { borderTop: "1px solid #eee", padding: "10px" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 540, width: "94%", margin: "10vh auto", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">{isEdit ? "Edit Category" : "Add Category"}</h5>
              <button className="btn btn-sm btn-light" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={form.color}
                    onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
                    style={{ width: "60px", height: "40px", padding: "2px" }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={form.color}
                    onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
                    placeholder="#5d0033"
                  />
                </div>
              </div>

              {/* Cities via checkboxes (both add & edit) */}
              <div className="mb-3">
                <label className="form-label">Select Cities</label>
                <div className="d-flex flex-wrap" style={{ gap: "8px" }}>
                  {cities.map((c) => (
                    <label
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #ddd",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={String(c.id)}
                        checked={form.cityIds.includes(String(c.id))}
                        onChange={(e) => {
                          const { checked, value } = e.target;
                          setForm((s) => ({
                            ...s,
                            cityIds: checked
                              ? [...s.cityIds, value]
                              : s.cityIds.filter((id) => id !== value),
                          }));
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowDelete(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: "92%", margin: "18vh auto", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Delete Category</h5>
              <button className="btn btn-sm btn-light" onClick={() => setShowDelete(false)}>
                ✕
              </button>
            </div>

            <p className="mb-4">
              Do you want to delete <strong>{deleteName || "this category"}</strong>?
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-light" onClick={() => setShowDelete(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
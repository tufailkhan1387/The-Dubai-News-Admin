import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../Utils/Toaster";

export default function SubCategory() {
  // force refetch by changing the query string
  const [refreshTick, setRefreshTick] = useState(0);

  const apiData = useFetch(`/admin/getAllSubCategories?t=${refreshTick}`);
  const getAllCategories = useFetch("/admin/getAllCategories");

  const [categoryData, setCategoryData] = useState([]);
  const [q, setQ] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", categoryId: "", color: "#5d0033" });
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const openDeleteModal = (row) => {
    setDeleteId(row.id);
    setDeleteName(row.name || "");
    setShowDelete(true);
  };

  const categories = getAllCategories?.apiData?.data?.categories || [];

  useEffect(() => {
    if (apiData?.apiData?.status === "1" && apiData?.apiData?.data?.categories) {
      const mapped = apiData.apiData.data.categories.map((item) => ({
        id: item.id,
        name: item.name,
        // include categoryId so edit modal can preselect
        categoryId: item.categoryId ?? item?.category?.id ?? "",
        category: item?.category?.name || "—",
        status: item.status ? "Active" : "Inactive",
        color: item.color || "#5d0033"
      }));
      setCategoryData(mapped);
    }
  }, [apiData?.apiData]);

  const filteredRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categoryData;
    return categoryData.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.category?.toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term)
    );
  }, [categoryData, q]);

  const openAddModal = () => {
    setIsEdit(false);
    setEditId(null);
    setForm({ name: "", categoryId: "", color: "#5d0033" });
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setIsEdit(true);
    setEditId(row.id);
    setForm({
      name: row.name || "",
      categoryId: row.categoryId ? String(row.categoryId) : "",
      color: row.color || "#5d0033"
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return error_toaster("Subcategory name is required");
    if (!form.categoryId) return error_toaster("Please select a category");

    try {
      setSaving(true);

      if (isEdit && editId) {
        // UPDATE
        const res = await PostApi("/admin/updateSubCategory", {
          id: editId,
          name: form.name.trim(),
          categoryId: form.categoryId,
          color: form.color
        });

        if (res?.data?.status === "1") {
          success_toaster("Subcategory updated successfully");
          setShowModal(false);

          // Optimistic local update
          const catName =
            categories.find((c) => String(c.id) === String(form.categoryId))?.name || "—";
          setCategoryData((prev) =>
            prev.map((r) =>
              r.id === editId
                ? {
                  ...r,
                  name: form.name.trim(),
                  categoryId: Number(form.categoryId),
                  category: catName,
                  color: form.color
                }
                : r
            )
          );

          // Hard refresh to sync with backend
          setRefreshTick(Date.now());
        } else {
          error_toaster(res?.data?.message || "Update failed");
        }
      } else {
        // CREATE
        const res = await PostApi("/admin/addSubCategory", {
          name: form.name.trim(),
          categoryId: form.categoryId,
          color: form.color
        });

        if (res?.data?.status === "1") {
          success_toaster("Subcategory added successfully");
          setShowModal(false);

          const catName =
            categories.find((c) => String(c.id) === String(form.categoryId))?.name || "—";
          setCategoryData((prev) => [
            {
              id: res?.data?.data?.id ?? Date.now(),
              name: form.name.trim(),
              categoryId: Number(form.categoryId),
              category: catName,
              status: "Active",
              color: form.color
            },
            ...prev,
          ]);

          setRefreshTick(Date.now());
        } else {
          error_toaster(res?.data?.message || "Something went wrong");
        }
      }
    } catch (err) {
      console.error(err);
      error_toaster(isEdit ? "Failed to update subcategory" : "Failed to add subcategory");
    } finally {
      setSaving(false);
    }
  };
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      // adjust URL if different
      const res = await PostApi("/admin/deleteSubCategory", { id: deleteId });

      if (res?.data?.status === "1") {
        success_toaster("Deleted successfully");
        setShowDelete(false);
        // optimistic remove
        setCategoryData((prev) => prev.filter((r) => r.id !== deleteId));
        // optional: force refetch if you have refreshTick
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
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
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
      width: "140px",
    },
  ];

  const filteredCities = filteredRows.filter((city) =>
  city.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>Sub Category</h4>
              <h6>Manage your sub categories</h6>
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

      {/* Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: "94%",
              margin: "10vh auto",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">{isEdit ? "Edit Subcategory" : "Add Subcategory"}</h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Subcategory Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="e.g. Tech Trends"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Color</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={form.color}
                    onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))
                    }
                    style={{ width: "60px", height: "40px", padding: "2px" }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={form.color}
                    onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))
                    }
                    placeholder="#5d0033"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, categoryId: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                  {saving ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
              <h5 className="m-0">Delete Subcategory</h5>
              <button className="btn btn-sm btn-light" onClick={() => setShowDelete(false)}>
                ✕
              </button>
            </div>

            <p className="mb-4">
              Do you want to delete <strong>{deleteName || "this subcategory"}</strong>?
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
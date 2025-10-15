import React, { useState, useEffect } from "react";

import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { error_toaster, success_toaster } from "../Utils/Toaster";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";
import { FRONT_SITE } from "../Utils/urls";


export default function News() {
  const navigate = useNavigate();
  const { apiData, reFetch } = useFetch("/admin/getAllNews");
  const [newsData, setNewsData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState(null);

  const [imgModal, setImgModal] = useState({ open: false, src: "" });
  const openImgModal = (src) => setImgModal({ open: true, src });
  const closeImgModal = () => setImgModal({ open: false, src: "" });
  const statusOptions = ["draft", "publish"];
  const [statusLoading, setStatusLoading] = useState({}); // { [id]: boolean }
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (apiData?.status === "1" && apiData?.data?.allNews) {
      const mappedData = apiData.data.allNews.map((item) => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        category: item.category?.name || "-",
        city: item.city?.name || "-",
        publisher: item.user?.name || "-",
        status:
          (item.status || item.newsStatus || item.state || "draft")
            .toString()
            .toLowerCase(),
      }));
      setNewsData(mappedData);
    }
  }, [apiData]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      setStatusLoading((s) => ({ ...s, [id]: true }));
      const res = await PostApi("/admin/changeNewsStatus", { id, status: nextStatus }, true);

      if (res?.data?.status === "1") {
        reFetch();
        success_toaster("Status updated");
      } else {
        error_toaster(res?.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("changeNewsStatus error:", err);
      error_toaster("Something went wrong while updating status");
    } finally {
      setStatusLoading((s) => ({ ...s, [id]: false }));
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await PostApi("/admin/deleteNews", { id });
      if (res?.data?.status === "1") {
        success_toaster("News deleted successfully");
        setNewsData((prev) => prev.filter((item) => item.id !== id));
        setShowDeleteModal(false);
      } else {
        error_toaster(res?.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      error_toaster("Failed to delete news");
    }
  };

  const EditNews = (id) => {
    navigate("/edit-news", { state: { id: id } });
  };

  const columns = [
    {
      name: "No",
      selector: (_, index) => String(index + 1).padStart(2, "0"),
      width: "50px",
    },
    {
      name: "Article Title",
      selector: (row) => row.title,
      sortable: true,
      width: "120px",
    },
    // {
    //   name: "Thumbnail",
    //   cell: (row) => (
    //     <img
    //       src={row.thumbnail}
    //       alt="Thumbnail"
    //       height={60}
    //       width={60}
    //       onClick={() => openImgModal(row.thumbnail)}
    //       style={{ objectFit: "cover", cursor: "zoom-in" }}
    //     />
    //   ),
    //   ignoreRowClick: true,
    // },

    {
      name: "Category",
      selector: (row) => row.category,
      width: "130px",
    },
    {
      name: "City",
      selector: (row) => row.city,
      width: "130px",
    },
    {
      name: "Publisher",
      selector: (row) => row.publisher,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-select form-select-sm"
          value={row.status}
          disabled={!!statusLoading[row.id]}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          style={{ minWidth: 130 }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: "160px",
    },

    {
      name: "View",
      cell: (row) => (
        <a
        onClick={()=>articleDetails(row.title)}
          href={`${FRONT_SITE}/article/${row.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm"
          style={{ backgroundColor: "#ffe5d1" }}
        >
          View
        </a>

      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            onClick={() => EditNews(row.id)}
            className="btn btn-sm btn-outline-primary"
            title="Edit"
          >
            <MdEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => {
              setDeleteNewsId(row.id);
              setShowDeleteModal(true);
            }}
          >
            <MdDelete />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredCities = newsData.filter((city) =>
    city.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>News</h4>
              <h6>Manage your News</h6>
            </div>
            <div className="page-btn">
              <Link to="/create-news">
                <button className="btn btn-primary">
                  <i className="me-2">+</i> Add New
                </button>
              </Link>
            </div>
          </div>

          <div className="card table-list-card">
            <div className="card-body p-3">
              <div className="table-top mb-3 d-flex justify-content-between">
                <div className="search-set">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    style={{ maxWidth: "250px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                </div>
              </div>

              <div style={{ overflowX: "auto", minWidth: "100%" }}>
                <DataTable
                  columns={columns}
                  data={filteredCities}
                  pagination
                  highlightOnHover
                  striped
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
                      style: {
                        borderTop: "1px solid #eee",
                        padding: "10px",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: "92%", margin: "18vh auto", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Delete News</h5>
              <button className="btn btn-sm btn-light" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <p className="mb-4">Are you sure you want to delete this news?</p>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-light" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteNewsId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {imgModal.open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }}
          onClick={closeImgModal}
        >
          <div
            className="card"
            style={{ maxWidth: "90vw", width: "fit-content", margin: "8vh auto", padding: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Thumbnail</h5>
              <button className="btn btn-sm btn-light" onClick={closeImgModal}>✕</button>
            </div>
            <img
              src={imgModal.src}
              alt="Profile Large"
              className="img-fluid"
              style={{ maxHeight: "80vh", maxWidth: "85vw", objectFit: "contain", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

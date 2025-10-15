import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import { Modal, Button, Form } from "react-bootstrap"; // or your own modal
import { PostApi } from "../ApiClient/PostApi"; // adjust if different
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Loader from "../Utils/Loader";

export default function AdsComponent() {
  const { apiData, reFetch } = useFetch("/admin/getAllAds");

  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAdId, setEditAdId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [deleteAdTitle, setDeleteAdTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newAd, setNewAd] = useState({
    title: "",
    image: null,          // actual file
    imagePreview: null,   // preview URL
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAd((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const openDeleteModal = (row) => {
    setDeleteAdId(row.id);
    setDeleteAdTitle(row.title || "");
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await PostApi("/admin/deleteAd", { id: deleteAdId });

      if (res?.data?.status === "1") {
        success_toaster("Ad deleted successfully");
        setShowDelete(false);
        // Optimistic update
        setAds((prev) => prev.filter((a) => a.id !== deleteAdId));
        // Hard refresh to be safe
        reFetch();
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

  const openModal = () => {
    setShowModal(true);
    setIsEditMode(false);
    setEditAdId(null);
    setNewAd({ title: "", image: null, imagePreview: null });
  };

  // Update local state when API data loads
  useEffect(() => {
    if (apiData?.status === "1" && apiData?.data?.adsData) {
      const mapped = apiData.data.adsData.map((ad) => ({
        id: ad.id,
        title: ad.title,
        image: ad.image,
      }));
      setAds(mapped);
    }
  }, [apiData]);

  const handleSubmitAd = async () => {
    if (!newAd.title) {
      error_toaster("Ad title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newAd.title);
    if (newAd.image) formData.append("image", newAd.image); // only if a new image is chosen

    try {
      isLoading(true);

      const endpoint = isEditMode
        ? `/admin/editAd/${editAdId}`
        : "/admin/addAd";

      const response = await PostApi(endpoint, formData, true);

      if (response?.data?.status === "1") {
        success_toaster(
          isEditMode ? "Ad updated successfully" : "Ad added successfully"
        );

        // Reset states
        setShowModal(false);
        setNewAd({ title: "", image: null, imagePreview: null });
        setIsEditMode(false);
        setEditAdId(null);

        // Refresh the list
        reFetch();
      } else {
        error_toaster(response?.data?.message || "Something went wrong");
      }

      isLoading(false);
    } catch (err) {
      isLoading(false);
      error_toaster("Something went wrong");
    }
  };

  const columns = [
    {
      name: "No",
      selector: (_, index) => String(index + 1).padStart(2, "0"),
      width: "80px",
    },
    {
      name: "Ad Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.title}
          width="40"
          height="40"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => {
              setIsEditMode(true);
              setEditAdId(row.id);
              setNewAd({
                title: row.title,
                image: null, // Image file won't be pre-filled
                imagePreview: row.image, // Show preview
              });
              setShowModal(true);
            }}
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

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading ? <Loader /> : (
        <div className="d-flex">
          <Sidebar />
          <div className="page-wrapper" style={{ width: "100%" }}>
            <div className="content">
              <div className="page-header d-flex justify-content-between align-items-center">
                <div className="page-title">
                  <h4>Ad Management</h4>
                  <h6>Manage your Ads</h6>
                </div>
                <div className="page-btn">
                  <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="me-2">+</i> Add New
                  </button>
                </div>
              </div>

              <div className="card table-list-card">
                <div className="card-body p-3">
                  <div
                    className="table-top mb-3 d-flex justify-content-between"
                    style={{ padding: "0px !important" }}
                  >
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

                  <DataTable
                    columns={columns}
                    data={filteredAds}
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
                      rows: {
                        style: {
                          fontSize: "14px",
                        },
                      },
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
          
          {/* Add/Edit Ad Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title> {isEditMode ? "Update Ad" : "Add New Ad"} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Ad Title Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Ad Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ad title"
                    value={newAd.title}
                    onChange={(e) =>
                      setNewAd((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </Form.Group>

                {/* Image Upload Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                  />
                  {newAd.imagePreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={newAd.imagePreview}
                        alt="Preview"
                        style={{ width: "150px", height: "auto", borderRadius: "6px" }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditAdId(null);
                  setNewAd({ title: "", image: null, imagePreview: null });
                }}
              >
                Cancel
              </Button>

              <Button variant="primary" onClick={handleSubmitAd}>
                {isEditMode ? "Update Ad" : "Add Ad"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Delete Ad Confirmation Modal */}
          <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Ad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you want to delete <strong>{deleteAdTitle || "this ad"}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setShowDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}

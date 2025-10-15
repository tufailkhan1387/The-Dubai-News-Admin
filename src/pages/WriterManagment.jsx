import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";

import { success_toaster, error_toaster } from "../Utils/Toaster";
import useFetch from "../ApiClient/GetApi";
import { PostApi } from "../ApiClient/PostApi";


export default function WriterManagement() {
  const [writers, setWriters] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWriterId, setDeleteWriterId] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const [newWriter, setNewWriter] = useState({
    name: "",
    profile_image: "",
    email: "",
    password: "",
  });

  // 1) State + handlers (put near other useState hooks)
  const [imgModal, setImgModal] = useState({ open: false, src: "" });
  const openImgModal = (src) => setImgModal({ open: true, src });
  const closeImgModal = () => setImgModal({ open: false, src: "" });


  // Fetch all writers using useFetch hook
  const { apiData, reFetch } = useFetch("/admin/getAllWriters");

  useEffect(() => {
    if (apiData?.status === "1" && apiData?.data?.writers) {
      setWriters(apiData.data.writers);
    } else if (apiData?.status === "0") {
      error_toaster(apiData?.message || "Failed to load writers");
    }

  }, [apiData]);



  // Handle modal input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWriter((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add new writer form submission
  const handleAddWriter = async (e) => {
    e.preventDefault();

    // Validation
    if (!newWriter.name || !newWriter.email || !newWriter.profile_image) {
      return error_toaster("All fields are required");
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", newWriter.name);
      formData.append("email", newWriter.email);
      formData.append("password", newWriter.password);
      formData.append("profile_image", newWriter.profile_image);

      const res = await PostApi("/admin/addWriter", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });

      if (res?.data?.status === "1") {
        success_toaster("Writer added successfully");

        reFetch();

        setShowModal(false); // Close the modal after adding
        setNewWriter({ name: "", profile_image: null, email: "" }); // Reset the form
      } else {
        error_toaster(res?.data?.message || "Failed to add writer");
      }
    } catch (error) {
      console.error(error);
      error_toaster("Error adding writer");
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setNewWriter((prev) => ({
        ...prev,
        profile_image: file, // Store the file itself in the state
      }));
    }
  };

  const handleDeleteWriter = async () => {
    try {
      const res = await PostApi("/admin/deleteWriter", { id: deleteWriterId });

      if (res?.data?.status === "1") {
        success_toaster("Writer deleted successfully");

        reFetch();
        setShowDeleteModal(false);
      } else {
        error_toaster(res?.data?.message || "Failed to delete writer");
      }
    } catch (error) {
      console.error(error);
      error_toaster("Error deleting writer");
    }
  };
  const handleDeleteModalOpen = (id) => {
    setDeleteWriterId(id);
    setShowDeleteModal(true); // Open the delete confirmation modal
  };

  const handleUpdateWriter = async (e) => {
    e.preventDefault();

    // Validation
    if (!newWriter.name || !newWriter.email) {
      return error_toaster("All fields are required");
    }

    try {
      // Create FormData object for update
      const formData = new FormData();
      formData.append("id", newWriter.id);
      formData.append("name", newWriter.name);
      formData.append("email", newWriter.email);
      if(newWriter.password){
        formData.append("password", newWriter.password);
      }
      if (newWriter.profile_image) {
        formData.append("profile_image", newWriter.profile_image);
      }

      const res = await PostApi("/admin/updateWriter", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });

      if (res?.data?.status === "1") {
        success_toaster("Writer updated successfully");

        reFetch();

        setShowModal(false); // Close the modal after updating
        setIsEdit(false); // Reset edit state
        setNewWriter({ id: null, name: "", profile_image: null, email: "" }); // Reset the form
      } else {
        error_toaster(res?.data?.message || "Failed to update writer");
      }
    } catch (error) {
      console.error(error);
      error_toaster("Error updating writer");
    }
  };
  const handleEditModalOpen = (writer) => {
    setIsEdit(true);
    setNewWriter({
      id: writer.id,
      name: writer.name,
      profile_image: writer.profile_image, // You can send this file as base64 or URL if required by the backend
      email: writer.email,
    });
    setShowModal(true);
  };

  const columns = [
    {
      name: "No",
      selector: (_, index) => String(index + 1).padStart(2, "0"),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    // 2) Replace your "Profile Image" column with this
    {
      name: "Profile Image",
      cell: (row) => (
        <img
          src={row.profile_image}
          alt="Profile"
          height={60}
          width={60}
          onClick={() => openImgModal(row.profile_image)}
          style={{ objectFit: "cover", cursor: "zoom-in" }}
        />
      ),
      ignoreRowClick: true,
    },

    {
      name: "Total Post",
      selector: (row) => row?.news?.length, // Using the news array length as total posts
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => handleEditModalOpen(row)}
          >
            <MdEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDeleteModalOpen(row.id)}
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

const filteredCities = writers.filter((city) =>
  city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  city.email?.toLowerCase().includes(searchTerm.toLowerCase())
);



  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>Writer Management</h4>
              <h6>Manage your writers</h6>
            </div>
            <div className="page-btn">
              <button className="btn btn-primary" onClick={() => {
                setNewWriter({
                  name: "",
                  profile_image: "",
                  email: ""
                });
                setIsEdit(false);
                setShowModal(true)
              }}>
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
                      style: { borderTop: "1px solid #eee", padding: "10px" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


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
              <h5 className="m-0">{isEdit ? "Edit Writer" : "Add New Writer"}</h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={isEdit ? handleUpdateWriter : handleAddWriter}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={newWriter.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
                  className="form-control"
                  type="file"
                  name="profile_image"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  value={newWriter.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  name="password"
                  value={newWriter.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  type="password"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update Writer" : "Add Writer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: 480,
              width: "92%",
              margin: "18vh auto",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Delete Writer</h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="mb-4">
              Are you sure you want to delete this writer?
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteWriter}
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
              <h5 className="m-0">Profile Image</h5>
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

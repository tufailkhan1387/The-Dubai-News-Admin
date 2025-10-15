import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import { Modal, Button, Form } from "react-bootstrap";
import { PostApi } from "../ApiClient/PostApi";
import { error_toaster, success_toaster } from "../Utils/Toaster";
import JoditEditor from "jodit-react";

export default function PageManagement() {
  const { apiData, reFetch, isLoading, error } = useFetch("/admin/getAllPages");
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePageId, setDeletePageId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contentHtml, setContentHtml] = useState("");
  const [newPage, setNewPage] = useState({
    name: "",
    slug: "",
    location: "",
    status: "approved",
  });
  const [editPage, setEditPage] = useState({ // State for the page to edit
    id: null,
    name: "",
    slug: "",
    location: "",
    status: "approved",
  });
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '')       // Remove non-alphanumeric characters
      .replace(/--+/g, '-')          // Replace multiple hyphens with one
      .replace(/^-+/, '')            // Remove leading hyphen
      .replace(/-+$/, '');           // Remove trailing hyphen
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewPage((prev) => {
      const updatedPage = { ...prev, [name]: value };

      // Automatically update the slug when the page name changes
      if (name === 'name') {
        updatedPage.slug = generateSlug(value);
      }

      return updatedPage;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newPage, // Spread the newPage data
      content: contentHtml, // Add the contentHtml data
    };


    let res = await PostApi("/admin/addPage", payload);
    if (res.data.status == "1") {
      setContentHtml("");
      reFetch();
      success_toaster(res.data.message);
      setShowModal(false); // Close modal after submission
      setNewPage({ name: "", slug: "", location: "", status: "Published" }); // Reset form

    }
    else {
      error_toaster(res.data.message);
    }

  };
  const handleDelete = async (pageId) => {
    setDeletePageId(pageId); // Set the page ID to delete
    setShowDeleteModal(true); // Show the confirmation modal
  };
  const handleEdit = (page) => {
    setEditPage({
      id: page.id,
      name: page.name,
      slug: page.slug,
      location: page.location,
      status: page.status,

    });
    setContentHtml(page.content)
    setShowEditModal(true); // Open the edit modal
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...editPage, // Spread the editPage data
      content: contentHtml, // Add the contentHtml data
    };
    let res = await PostApi("/admin/updatePage", payload);
    if (res.data.status === "1") {
      reFetch();
      success_toaster(res.data.message);
      setShowEditModal(false); // Close edit modal
      setContentHtml("")
    } else {
      error_toaster(res.data.message);
    }
  };
  // Confirm the deletion
  const confirmDelete = async (e) => {
    try {
      e.preventDefault();
      console.log(newPage); // Log the form data to console

      let res = await PostApi("/admin/deletePage", { deletePageId });
      if (res.data.status == "1") {
        reFetch();
        success_toaster(res.data.message);
        setShowModal(false); // Close modal after submission
        setNewPage({ name: "", slug: "", location: "", status: "Published" }); // Reset form
        setShowDeleteModal(false)
      }
      else {
        error_toaster(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the page.");
    }
  };
  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePageId(null); // Reset the page ID
  };
  // Handle the API data once it's fetched
  useEffect(() => {
    if (apiData?.data?.pages) {
      setPages(apiData.data.pages);
    }
  }, [apiData]);

  const handleStatusChange = (id, newStatus) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, status: newStatus } : page
      )
    );
  };

  const columns = [
    {
      name: "No",
      selector: (_, index) => String(index + 1).padStart(2, "0"),
      width: "80px",
    },
    {
      name: "Page Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
    },
    {
      name: "Location",
      selector: (row) => row.location,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-select form-select-sm"
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="reject">Reject</option>
        </select>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => handleEdit(row)} // Open edit modal
          >
            <MdEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(row.id)} // Handle delete action
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const config = {
    height: 500,
    minHeight: 400,
    readonly: false,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "image",
      "video",
      "table",
      "|",
      "eraser",
      "undo",
      "redo",
    ],
    uploader: { insertImageAsBase64URI: true },
  };

  const openModal = () =>{
    setShowModal(true);
    setContentHtml("")
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div className="page-title">
              <h4>Page Management</h4>
              <h6>Manage your Pages</h6>
            </div>
            <div className="page-btn">
              <button className="btn btn-primary" onClick={() => openModal()}>
                <i className="me-2">+</i> Add New
              </button>
              {/* Add New Page Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                  <Modal.Title>Add New Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    {/* First row with two fields */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Label>Page Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter page name"
                          value={newPage.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                          type="text"
                          name="slug"
                          placeholder="Enter page slug"
                          value={newPage.slug}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Second row with two fields */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="Enter page location"
                          value={newPage.location}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          as="select"
                          name="status"
                          value={newPage.status}
                          onChange={handleInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="reject">Reject</option>
                        </Form.Control>
                      </div>
                    </div>

                    {/* Content editor */}
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <JoditEditor
                        value={contentHtml}
                        config={config}
                        onBlur={(newContent) => setContentHtml(newContent)}
                        onChange={() => { }}
                      />
                    </div>

                    <Button variant="primary" type="submit">
                      Add Page
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>


              {/* Delete Confirmation Modal */}
              <Modal show={showDeleteModal} onHide={cancelDelete}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this page?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={cancelDelete}>
                    No
                  </Button>
                  <Button variant="danger" onClick={confirmDelete}>
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* Edit Page Modal */}
              <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl">
                <Modal.Header closeButton>
                  <Modal.Title>Edit Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleEditSubmit}>
                    {/* First Row: Page Name and Slug */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Label>Page Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={editPage.name}
                          onChange={handleEditInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                          type="text"
                          name="slug"
                          value={editPage.slug}
                          onChange={handleEditInputChange}
                        />
                      </div>
                    </div>

                    {/* Second Row: Location and Status */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={editPage.location}
                          onChange={handleEditInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          as="select"
                          name="status"
                          value={editPage.status}
                          onChange={handleEditInputChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="reject">Reject</option>
                        </Form.Control>
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <JoditEditor
                        value={contentHtml}
                        config={config}
                        onBlur={(newContent) => setContentHtml(newContent)}  // Update contentHtml when user modifies the content
                        onChange={() => { }}
                      />
                    </div>

                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>


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
                  />
                </div>
              </div>

              <div style={{ overflowX: "auto", minWidth: "100%" }}>
                <DataTable
                  columns={columns}
                  data={pages}
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
      </div>
    </div>
  );
}

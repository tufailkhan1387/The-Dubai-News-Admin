import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { MdEdit, MdDelete } from "react-icons/md";
import useFetch from "../ApiClient/GetApi";
import { Modal, Button, Form } from "react-bootstrap"; // or your own modal
import { PostApi } from "../ApiClient/PostApi"; // adjust if different
import { success_toaster, error_toaster } from "../Utils/Toaster";
import Loader from "../Utils/Loader";


export default function City() {
  const { apiData, reFetch } = useFetch("/admin/getAllCities");

  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCityId, setEditCityId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteCityId, setDeleteCityId] = useState(null);
  const [deleteCityName, setDeleteCityName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [newCity, setNewCity] = useState({
    name: "",
    image: null,          // actual file
    imagePreview: null,   // preview URL
    comingSoon: false,
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCity((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };
  const openDeleteModal = (row) => {
    setDeleteCityId(row.id);
    setDeleteCityName(row.name || "");
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const res = await PostApi("/admin/deleteCity", { id: deleteCityId }); // adjust URL if needed

      if (res?.data?.status === "1") {
        success_toaster("City deleted successfully");
        setShowDelete(false);
        // Optimistic update
        setCities((prev) => prev.filter((c) => c.id !== deleteCityId));
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
    setEditCityId(null);
    setNewCity({ name: "", image: null, imagePreview: null, comingSoon: false });
  }

  // Update local state when API data loads
  useEffect(() => {
    if (apiData?.status === "1" && apiData?.data?.cities) {
      const mapped = apiData.data.cities.map((city) => ({
        id: city.id,
        name: city.name,
        image: city.image,
        comingSoon: city.comingSoon,
      }));
      setCities(mapped);
    }
  }, [apiData]);

  const toggleComingSoon = (id) => {
    setCities((prev) =>
      prev.map((city) =>
        city.id === id ? { ...city, comingSoon: !city.comingSoon } : city
      )
    );
  };

  const handleSubmitCity = async () => {
    if (!newCity.name) {
      error_toaster("City name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCity.name);
    formData.append("comingSoon", newCity.comingSoon);
    if (newCity.image) formData.append("image", newCity.image); // only if a new image is chosen

    try {
      isLoading(true);

      const endpoint = isEditMode
        ? `/admin/editCity/${editCityId}`
        : "/admin/addCity";

      const response = await PostApi(endpoint, formData, true);

      if (response?.data?.status === "1") {
        success_toaster(
          isEditMode ? "City updated successfully" : "City added successfully"
        );

        // Reset states
        setShowModal(false);
        setNewCity({ name: "", image: null, imagePreview: null, comingSoon: false });
        setIsEditMode(false);
        setEditCityId(null);

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
      name: "City Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.name}
          width="40"
          height="40"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      name: "Coming Soon",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.comingSoon}
          onChange={() => toggleComingSoon(row.id)}
        />
      ),
      center: true,
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
              setEditCityId(row.id);
              setNewCity({
                name: row.name,
                image: null, // Image file won't be pre-filled
                imagePreview: row.image, // Show preview
                comingSoon: row.comingSoon,
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
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {
        loading ? <Loader /> : <div className="d-flex">
          <Sidebar />
          <div className="page-wrapper" style={{ width: "100%" }}>
            <div className="content">
              <div className="page-header d-flex justify-content-between align-items-center">
                <div className="page-title">
                  <h4>City Management</h4>
                  <h6>Manage your Cities</h6>
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
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title> {isEditMode ? "Update City" : "Add New City"} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* City Name Input */}
                <Form.Group className="mb-3">
                  <Form.Label>City Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city name"
                    value={newCity.name}
                    onChange={(e) =>
                      setNewCity((prev) => ({ ...prev, name: e.target.value }))
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
                  {newCity.imagePreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={newCity.imagePreview}
                        alt="Preview"
                        style={{ width: "150px", height: "auto", borderRadius: "6px" }}
                      />
                    </div>
                  )}
                </Form.Group>

                {/* Coming Soon Checkbox */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Coming Soon"
                    checked={newCity.comingSoon}
                    onChange={(e) =>
                      setNewCity((prev) => ({
                        ...prev,
                        comingSoon: e.target.checked,
                      }))
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(false);
                  setIsEditMode(false);
                  setEditCityId(null);
                  setNewCity({ name: "", image: null, imagePreview: null, comingSoon: false });
                }}
              >
                Cancel
              </Button>

              <Button variant="primary" onClick={handleSubmitCity}>
                {isEditMode ? "Update City" : "Add City"}
              </Button>

            </Modal.Footer>
          </Modal>
          <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete City</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you want to delete <strong>{deleteCityName || "this city"}</strong>?
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
      }
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import useFetch from "../../ApiClient/GetApi";
import { PostApi } from "../../ApiClient/PostApi";
import { success_toaster, error_toaster } from "../../Utils/Toaster";

export default function WriterProfile() {
  const { apiData } = useFetch("/admin/profile");
  console.log(apiData?.data?.userData)

  // Derive user payload defensively
  const user = apiData?.data?.userData;
  const initialImage = user?.profile_image;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(""); // optional
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImage);

  // Prefill when data arrives
  useEffect(() => {
    if ( apiData) {
      const u = apiData?.data?.userData;
      setName(u?.name || "");
      setEmail(u?.email || "");
      const img = u?.profile_image || u?.avatar || "";
      setPreview(img || null);
    }
  }, [apiData]);

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(initialImage || null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return error_toaster("Name is required");
    if (!email.trim()) return error_toaster("Email is required");

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("email", email.trim());
      if (password?.trim()) fd.append("password", password.trim()); // optional
      if (file instanceof File) fd.append("profile_image", file);

      // Adjust endpoint if your API differs
      const res = await PostApi("/admin/update_profile", fd, true);

      if (res?.data?.status === "1") {
        success_toaster("Profile updated successfully");
        // Optionally clear password field after success
        setPassword("");
      } else {
        error_toaster(res?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      error_toaster("Something went wrong");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: "100%" }}>
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Profile</h4>
              <h6>User Profile</h6>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {/* Top: avatar + quick text */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="position-relative">
                  <img
                    src={preview || "/assets/img/customer/customer5.jpg"}
                    alt="profile"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                    onError={(e) => (e.currentTarget.src = "/assets/img/customer/customer5.jpg")}
                  />
                </div>

                <div>
                  <h5 className="mb-1">{name || "Your Name"}</h5>
                  <div className="text-muted">Update your photo and personal details.</div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit}>
                <div className="row">
                  {/* Profile image */}
                  <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Name */}
                  <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>

                  {/* Optional Password */}
                  <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="form-label">Password (optional)</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="col-12 mt-2 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary me-2">
                      Save Changes
                    </button>
                   
                  </div>
                </div>
              </form>
              {/* /Form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

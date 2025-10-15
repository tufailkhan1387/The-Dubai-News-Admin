import React, { Profiler, useEffect, useMemo, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaChartBar, FaNewspaper, FaPenFancy, FaVideo } from "react-icons/fa";
import { MdLogout, MdOutlineEditNote, MdSubdirectoryArrowRight } from "react-icons/md";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [role, setRole] = useState("admin");
  const [showButtons, setShowButtons] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profile_image, set_profile_image] = useState("");

  const isActive = (path) => (location.pathname === path ? "active" : "");

  useEffect(() => {
    const checkScreenSize = () => setIsMobileOrTablet(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const image = localStorage.getItem("profile_image");
    set_profile_image(image);
    const rr = localStorage.getItem("role");
    if (rr) setRole(rr);
  }, []);

  const toggleButtons = () => setShowButtons((s) => !s);
  const toggleDropdown = () => setDropdownVisible((s) => !s);

  const logout = () => {
    localStorage.removeItem("loginstatus");
    navigate("/sign-in");
  };

  // Admin menu
  const adminMenu = useMemo(
    () => [
      { to: "/", icon: <RiDashboardHorizontalFill />, label: "Dashboard" },
      { to: "/category", icon: <BiCategoryAlt />, label: "Category Management" },
      { to: "/sub-category", icon: <MdSubdirectoryArrowRight />, label: "Sub Category" },
      { to: "/city", icon: <PiSuitcaseSimpleBold />, label: "City Management" },
      { to: "/news", icon: <FaNewspaper />, label: "News" },
      { to: "/page", icon: <MdOutlineEditNote />, label: "Page Management" },
      { to: "/writer-management", icon: <FaPenFancy />, label: "Writer Management" },
      { to: "/report", icon: <FaChartBar />, label: "Reports" },
      { to: "/profile", icon: <AiOutlineUser />, label: "Profile Settings" },
      { to: "/home-settings", icon: <BiCategoryAlt />, label: "Home Settings" },
      { to: "/category-page-settings", icon: <FaNewspaper />, label: "Category Settings" },
      { to: "/settings/sub-category", icon: <FaPenFancy />, label: "Sub Category Settings" },
      { to: "/settings/article", icon: <MdSubdirectoryArrowRight />, label: "Article Page Settings" },
      { to: "/video-upload", icon: <FaVideo />, label: "Video Upload" },
    ],
    []
  );

  // Writer menu
  const writerMenu = useMemo(
    () => [
      { to: "/", icon: <RiDashboardHorizontalFill />, label: "Dashboard" },
      { to: "/writer-news", icon: <FaNewspaper />, label: "All News" },
      { to: "/writer-create-news", icon: <MdOutlineEditNote />, label: "Add News" },
      { to: "/writer-profile", icon: <AiOutlineUser />, label: "Profile Settings" },
    ],
    []
  );

  const menu = role === "admin" ? adminMenu : writerMenu;

  return (
    <div>
      <ToastContainer />

      {/* ===== Header ===== */}
      <div className="header">
        <span className="mobile_btn" onClick={toggleButtons}>
          <TiThMenu />
        </span>

        {/* Mobile menu */}
        {isMobileOrTablet && showButtons && (
          <div style={{ padding: "10px", marginTop: "20px" }}>
            <ul className="bg-primary" style={{ padding: "10px", borderRadius: "5px" }}>
              {menu.map((m) => (
                <li key={m.to} className={`p-2 ${isActive(m.to)}`}>
                  <Link className="text-white d-flex align-items-center gap-2" to={m.to}>
                    {m.icon} {m.label}
                  </Link>
                </li>
              ))}
              <li className="p-2">
                <button className="btn btn-link text-white d-flex align-items-center gap-2 p-0" onClick={logout}>
                  <MdLogout /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Profile / Brand bar */}
        <ul className="nav user-menu bg-primary d-flex justify-content-between">
          <div>
            <img
              src="/assets/img/logo.png"
              alt="Logo"
              style={{ height: "80px", padding: "0 20px" }}
            />
          </div>

          <li className="nav-item dropdown has-arrow main-drop">
            <a
              href="#"
              className="dropdown-toggle nav-link userset"
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
            >
              <span className="user-info d-flex align-items-center">
                <span className="user-letter">
                  <img src={profile_image} alt="Avatar" />
                </span>
                <span className="user-detail ms-2">
                  <span className="user-name d-block text-white">John Doe</span>
                  <span className="user-role text-white">{role === "admin" ? "Admin" : "Writer"}</span>
                </span>
              </span>
            </a>

            {dropdownVisible && (
              <div
                className="dropdown-menu menu-drop-user"
                style={{ position: "absolute", zIndex: 999 }}
              >
                <div className="profilename">
                  <div className="profileset d-flex align-items-center gap-2">
                    <span className="user-img">
                      <img src="assets/img/profiles/avator1.jpg" alt="" />
                      <span className="status online"></span>
                    </span>
                    <div className="profilesets">
                      <h6>John Doe</h6>
                      <h5 className="text-muted">{role === "admin" ? "Admin" : "Writer"}</h5>
                    </div>
                  </div>
                  <hr className="m-0" />
                  <Link className="dropdown-item" to="/profile">
                    <RiDashboardHorizontalFill className="me-2" /> My Profile
                  </Link>
                  <Link className="dropdown-item" to="/change-password">
                    <MdOutlineEditNote className="me-2" /> Change Password
                  </Link>
                  <hr className="m-0" />
                  <button className="dropdown-item logout pb-0 d-flex align-items-center gap-2" onClick={logout}>
                    <MdLogout /> Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* ===== Sidebar ===== */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu" style={{ width: "230px" }}>
            <ul>
              <li className="submenu-open">
                <ul>
                  {menu.map((m) => (
                    <li key={m.to} className={isActive(m.to)}>
                      <Link to={m.to} className="d-flex align-items-center gap-2">
                        {m.icon} <span>{m.label}</span>
                      </Link>
                    </li>
                  ))}

                  <li onClick={logout}>
                    <Link


                    >
                      <MdLogout /> <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

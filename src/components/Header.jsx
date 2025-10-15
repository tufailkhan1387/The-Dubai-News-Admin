import React from "react";

export default function Header() {
  return (
    <div className="header">
      <div className="header-left active">
        <a href="/" className="logo logo-normal custom-title">
          <img src="/assets/img/logo.png" alt="Logo" />
        </a>
        <a href="/" className="logo logo-white">
          <img src="/assets/img/logo.png" alt="Logo" />
        </a>
        <a href="/" className="logo-small">
          <img src="/assets/img/logo.png" alt="Logo" />
        </a>
        <a id="toggle_btn" href="#">
          <i data-feather="chevrons-left" className="feather-16"></i>
        </a>
      </div>

      <a id="mobile_btn" className="mobile_btn" href="#sidebar">
        <span className="bar-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </a>

      <ul className="nav user-menu">
        <li className="nav-item dropdown has-arrow main-drop">
          <a href="#" className="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
            <span className="user-info">
              <span className="user-letter">
                <img src="/assets/img/profiles/avator1.jpg" alt="" className="img-fluid" />
              </span>
              <span className="user-detail">
                <span className="user-name">John Smilga</span>
                <span className="user-role">Super Admin</span>
              </span>
            </span>
          </a>
          <div className="dropdown-menu menu-drop-user">
            <div className="profilename">
              <div className="profileset">
                <span className="user-img">
                  <img src="/assets/img/profiles/avator1.jpg" alt="" />
                  <span className="status online"></span>
                </span>
                <div className="profilesets">
                  <h6>John Smilga</h6>
                  <h5>Super Admin</h5>
                </div>
              </div>
              <hr className="m-0" />
              <a className="dropdown-item" href="/profile">
                <i className="me-2" data-feather="user"></i> My Profile
              </a>
              <hr className="m-0" />
              <a className="dropdown-item logout pb-0" href="/signin">
                <img src="/assets/img/icons/log-out.svg" className="me-2" alt="Logout Icon" />Logout
              </a>
            </div>
          </div>
        </li>
      </ul>

      <div className="dropdown mobile-user-menu">
        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
          <i className="fa fa-ellipsis-v"></i>
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="/profile">My Profile</a>
          <a className="dropdown-item" href="/signin">Logout</a>
        </div>
      </div>
    </div>
  );
}

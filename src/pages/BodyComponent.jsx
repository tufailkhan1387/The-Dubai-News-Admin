import React from "react";
import { Link } from "react-router-dom";

export default function BodyComponent() {
  return (
    <div className="main-wrapper">
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="submenu-open">
                <ul>
                  <li><Link to="/dashboard"><i data-feather="grid"></i><span>Dashboard</span></Link></li>
                  <li><Link to="/category"><i data-feather="codepen"></i><span>Category Management</span></Link></li>
                  <li><Link to="/sub-category"><i data-feather="speaker"></i><span>Sub Category</span></Link></li>
                  <li className="active"><Link to="/city"><i data-feather="git-merge"></i><span>City Management</span></Link></li>
                  <li><Link to="/news"><i data-feather="book-open"></i><span>News</span></Link></li>
                  <li><Link to="/page"><i data-feather="edit"></i><span>Page Management</span></Link></li>
                  <li><Link to="/writer-management"><i data-feather="edit"></i><span>Writer Management</span></Link></li>
                  <li><Link to="/report"><i data-feather="bar-chart-2"></i><span>Reports</span></Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>City Management</h4>
              <h6>Manage your Cities</h6>
            </div>
            <div className="page-btn">
              <button className="btn btn-added" data-bs-toggle="modal" data-bs-target="#add-city">
                <i data-feather="plus-circle" className="me-2"></i>Add New
              </button>
            </div>
          </div>

          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <button className="btn btn-searchset">
                      <i data-feather="search" className="feather-search"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table datanew">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>City Name</th>
                      <th>Image</th>
                      <th>Coming Soon</th>
                      <th className="no-sort">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>Lahore</td>
                      <td><img src="assets/img/product4.jpg" alt="city" /></td>
                      <td><input type="checkbox" defaultChecked /></td>
                      <td>
                        <div className="edit-delete-action">
                          <button className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-city">
                            <i data-feather="edit"></i>
                          </button>
                          <button className="confirm-text p-2">
                            <i data-feather="trash-2"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>02</td>
                      <td>Islamabad</td>
                      <td><img src="assets/img/product4.jpg" alt="city" /></td>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="edit-delete-action">
                          <button className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-city">
                            <i data-feather="edit"></i>
                          </button>
                          <button className="confirm-text p-2">
                            <i data-feather="trash-2"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>03</td>
                      <td>Karachi</td>
                      <td><img src="assets/img/product4.jpg" alt="city" /></td>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="edit-delete-action">
                          <button className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-city">
                            <i data-feather="edit"></i>
                          </button>
                          <button className="confirm-text p-2">
                            <i data-feather="trash-2"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
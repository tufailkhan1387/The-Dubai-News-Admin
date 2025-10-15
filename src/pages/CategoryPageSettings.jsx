import React from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

export default function CategoryPageSettings() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper" style={{ width: '100%' }}>
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Category Page Settings</h4>
              <h6>Configure category page content sections</h6>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {/* Main Section */}
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="btn btn-light btn-sm rounded me-2">
                        <i className="fa fa-th-large" />
                      </span>
                      <h5 className="mb-0">Main Section</h5>
                    </div>
                    <p className="text-muted small mb-3">
                      Configure the main content area (hero/featured posts) for this category page.
                    </p>
                    <div className="mt-auto">
                      <Link to="/settings/category/main" className="btn btn-primary w-100">
                        Manage Main Section
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Trending News */}
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="btn btn-light btn-sm rounded me-2">
                        <i className="fa fa-fire" />
                      </span>
                      <h5 className="mb-0">Trending News</h5>
                    </div>
                    <p className="text-muted small mb-3">
                      Curate or auto-pick trending news specific to this category.
                    </p>
                    <div className="mt-auto">
                      <Link to="/settings/category/trending" className="btn btn-outline-primary w-100">
                        Configure Trending
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Ad Section */}
                <div className="col-12 col-md-6 col-xl-4">
                  <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="btn btn-light btn-sm rounded me-2">
                        <i className="fa fa-bullhorn" />
                      </span>
                      <h5 className="mb-0">Ad Section</h5>
                    </div>
                    <p className="text-muted small mb-3">
                      Manage ad slots, placements, and creatives for this category page.
                    </p>
                    <div className="mt-auto">
                      <Link to="/settings/category/ads" className="btn btn-outline-primary w-100">
                        Manage Ads
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional compact button row */}
              {/*
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to="/settings/category/main" className="btn btn-primary">
                  <i className="fa fa-th-large me-2" /> Main Section
                </Link>
                <Link to="/settings/category/trending" className="btn btn-outline-primary">
                  <i className="fa fa-fire me-2" /> Trending News
                </Link>
                <Link to="/settings/category/ads" className="btn btn-outline-primary">
                  <i className="fa fa-bullhorn me-2" /> Ad Section
                </Link>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

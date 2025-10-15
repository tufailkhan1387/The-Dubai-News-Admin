import React from 'react'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'

export default function HomeSettings() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="page-wrapper" style={{ width: "100%" }}>
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Home Settings</h4>
                            <h6>Configure homepage content sections</h6>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="row g-3">
                                {/* Pin Article Setting */}
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="btn btn-light btn-sm rounded me-2">
                                                <i className="fa fa-thumb-tack" />
                                            </span>
                                            <h5 className="mb-0">Pin Article</h5>
                                        </div>
                                        <p className="text-muted small mb-3">
                                            Choose articles to pin at the top of your homepage.
                                        </p>
                                        <div className="mt-auto">
                                            <Link to="/settings/pin-article" className="btn btn-primary w-100">
                                                Manage Pin Articles
                                            </Link>
                                            {/* If using router:
                      <Link to="/settings/pin-article" className="btn btn-primary w-100">Manage Pin Articles</Link>
                      */}
                                        </div>
                                    </div>
                                </div>

                                {/* Trending Section Articles */}
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="btn btn-light btn-sm rounded me-2">
                                                <i className="fa fa-fire" />
                                            </span>
                                            <h5 className="mb-0">Trending Articles</h5>
                                        </div>
                                        <p className="text-muted small mb-3">
                                            Curate or auto-pick trending content for the homepage.
                                        </p>
                                        <div className="mt-auto">
                                            <Link to="/settings/trending" className="btn btn-outline-primary w-100">
                                                Configure Trending
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Adds Section */}
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="btn btn-light btn-sm rounded me-2">
                                                <i className="fa fa-bullhorn" />
                                            </span>
                                            <h5 className="mb-0">Ads Section</h5>
                                        </div>
                                        <p className="text-muted small mb-3">
                                            Manage ad slots, placements, and creatives.
                                        </p>
                                        <div className="mt-auto">
                                            <Link to="/settings/ads" className="btn btn-outline-primary w-100">
                                                Manage Ads
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Top pick Section */}
                                <div className="col-12 col-md-6 col-xl-3">
                                    <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="btn btn-light btn-sm rounded me-2">
                                                <i className="fa fa-star" />
                                            </span>
                                            <h5 className="mb-0">Top Picks</h5>
                                        </div>
                                        <p className="text-muted small mb-3">
                                            Highlight editor’s top picks on the homepage.
                                        </p>
                                        <div className="mt-auto">
                                            <Link to="/settings/top-picks" className="btn btn-outline-primary w-100">
                                                Configure Top Picks
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional: a compact button row version */}
                            {/* 
              <div className="d-flex flex-wrap gap-2 mt-4">
                <a href="/settings/pin-article" className="btn btn-primary">
                  <i className="fa fa-thumb-tack me-2" /> Pin Article Setting
                </a>
                <a href="/settings/trending" className="btn btn-outline-primary">
                  <i className="fa fa-fire me-2" /> Trending Section Articles
                </a>
                <a href="/settings/ads" className="btn btn-outline-primary">
                  <i className="fa fa-bullhorn me-2" /> Ads Section
                </a>
                <a href="/settings/top-picks" className="btn btn-outline-primary">
                  <i className="fa fa-star me-2" /> Top pick Section
                </a>
              </div>
              */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

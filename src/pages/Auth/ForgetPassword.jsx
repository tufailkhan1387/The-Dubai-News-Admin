import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { error_toaster, success_toaster } from '../../Utils/Toaster';
import { ToastContainer } from 'react-toastify';
import { PostApi } from '../../ApiClient/PostApi';
import Loader from '../../Utils/Loader';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            error_toaster('Email is required');
            return;
        }

        setLoading(true);

        try {
            // Make API request to forget password
            const response = await PostApi('/admin/forgetPasswordRequest', { email });
            console.log(response?.data?.data)

            // Assuming the API returns a success message on success
            if (response.data.status == "1") {
                success_toaster('Password reset link has been sent to your email.');
                localStorage.setItem('forgetRequestId',response?.data?.data?.forgetRequestId)
                localStorage.setItem('userId',response?.data?.data?.userId);
                navigate('/verify-otp');
            } else {
                error_toaster(response.message || 'Something went wrong!');
            }
        } catch (error) {
            error_toaster('An error occurred while requesting password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-page">
            <ToastContainer />

            {loading ? <Loader /> : 
                <div>
                    <div className="main-wrapper">
                        <div className="account-content">
                            <div className="login-wrapper d-flex justify-content-center align-items-center">
                                <div className="login-content neumorphic">
                                    <form onSubmit={handleSubmit}>
                                        <div className="login-userset">
                                            <div className="login-logo logo-normal">
                                                <img src="/assets/img/logo.png" alt="Logo" />
                                            </div>
                                            <Link to="/" className="login-logo logo-white">
                                                <img src="/assets/img/logo.png" alt="Logo" />
                                            </Link>
                                            <div className="login-userheading">
                                                <h3>Forgot Password</h3>
                                                <h4>Enter your email to reset your password.</h4>
                                            </div>

                                            <div className="form-login mb-3">
                                                <label className="form-label">Email Address</label>
                                                <div className="form-addons">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <img src="/assets/img/icons/mail.svg" alt="mail-icon" />
                                                </div>
                                            </div>

                                            <div className="form-login">
                                                <button type="submit" className="btn btn-login">
                                                  Submit
                                                </button>
                                            </div>

                                            <div className="signinform">
                                                <h4>
                                                    Remember your password?
                                                    <Link to="/sign-in" className="hover-a"> Back to Sign In</Link>
                                                </h4>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="customizer-links" id="setdata">
                        <ul className="sticky-sidebar">
                            <li className="sidebar-icons">
                                <a
                                    href="#"
                                    className="navigation-add"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    data-bs-original-title="Theme"
                                >
                                    <i data-feather="settings" className="feather-five"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
}

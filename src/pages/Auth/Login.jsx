import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { error_toaster, success_toaster } from '../../Utils/Toaster';
import { ToastContainer } from 'react-toastify';
import { PostApi } from '../../ApiClient/PostApi';
import Loader from '../../Utils/Loader';




export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Track password visibility
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ This prevents the page reload
        console.log(email)
        try {

            if (email == '' || password == '') {

                error_toaster('Email and Password are required.');
                return;
            }

            setLoading(true);
            let response = await PostApi('/admin/login', { email, password });
            console.log(response?.data)

            if (response.data.status === "1") {

                setLoading(false);
                localStorage.setItem("loginstatus", "1");
                localStorage.setItem("userId", response.data.data.id);
                localStorage.setItem("image", response?.data?.data?.profile_image);
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("profile_image", response.data.data.profile_image);
                localStorage.setItem("role", response.data.data.role);
                localStorage.setItem("name", response.data.data.name);
                success_toaster(response.data.message);
                if (response.data.data.role == "admin") {
                    navigate("/");
                }
                else{
                    navigate("/writer");
                }


            } else {
                error_toaster(response.data.message);
                setLoading(false);
            }
        } catch (error) {
            error_toaster(error.message);
            setLoading(false);
        }
    };


    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="account-page">
            <ToastContainer />

            {
                loading ? <Loader /> :
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
                                                    <h3>Sign In</h3>
                                                    <h4>Access the That Media Group by entering your email and passcode.</h4>
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

                                                <div className="form-login mb-3">
                                                    <label className="form-label">Password</label>
                                                    <div className="pass-group position-relative">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="pass-input form-control"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <span
                                                            className={`fas toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            onClick={togglePassword}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '15px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                            }}
                                                        ></span>
                                                    </div>
                                                </div>

                                                <div className="form-login authentication-check">
                                                    <div className="row">
                                                        <div className="col-12 d-flex align-items-center justify-content-between">

                                                            <div className="text-end">
                                                                <Link to="/forget-password" className="forgot-link">
                                                                    Forgot Password?
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-login">
                                                    <button type="submit" className="btn btn-login">

                                                        Sign In
                                                    </button>
                                                </div>

                                                {/* <div className="signinform">
                                                    <h4>
                                                        New on our platform?
                                                        <Link to="/register" className="hover-a"> Create an account</Link>
                                                    </h4>
                                                </div> */}
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

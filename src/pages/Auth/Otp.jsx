import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { error_toaster, success_toaster } from '../../Utils/Toaster';
import { ToastContainer } from 'react-toastify';
import { PostApi } from '../../ApiClient/PostApi';
import Loader from '../../Utils/Loader';

export default function Otp() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log(localStorage.getItem('userId'))

    // Handle OTP input changes and move focus to next input
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Allow only numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input field if current input is filled
        if (value && index < otp.length - 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            nextInput && nextInput.focus();
        }
    };

    // Handle form submission for OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (otp.some(digit => digit === '')) {
            error_toaster('Please enter all 4 digits of the OTP');
            return;
        }

        setLoading(true);

        const otpCode = otp.join(''); // Combine OTP digits into one string
        const forgetPasswordId = localStorage.getItem("forgetRequestId");
        const userId = localStorage.getItem("userId");

        try {
            // Make API request to submit OTP
            const response = await PostApi('/admin/submitOtp', { otp: otpCode, forgetPasswordId, userId });
            console.log(response);

            if (response.data.status === "1") {
                success_toaster('OTP verification successful.');
                navigate('/new-password'); // Navigate to the page where the user can set a new password
            } else {
                error_toaster(response.message || 'Invalid OTP, please try again.');
            }
        } catch (error) {
            error_toaster('An error occurred while verifying OTP.');
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
                                                <h3>Enter OTP</h3>
                                                <h4>Enter the 4-digit OTP sent to your email.</h4>
                                            </div>

                                            <div className="form-login mb-3">
                                                <label className="form-label">OTP</label>
                                                <div className="otp-input d-flex justify-content-between">
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            id={`otp-input-${index}`}
                                                            style={{ width: "50px" }}
                                                            type="text"
                                                            className="form-control otp-field"
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(e, index)}
                                                            maxLength="1"
                                                            autoFocus={index === 0} // Automatically focus on the first input
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="form-login">
                                                <button type="submit" className="btn btn-login">
                                                    Verify OTP
                                                </button>
                                            </div>

                                            <div className="signinform">
                                                <h4>
                                                    Didn't receive the OTP? 
                                                    <Link to="/resend-otp" className="hover-a"> Resend OTP</Link>
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

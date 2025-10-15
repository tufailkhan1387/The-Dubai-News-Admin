import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { error_toaster, success_toaster } from '../../Utils/Toaster';
import { ToastContainer } from 'react-toastify';
import { PostApi } from '../../ApiClient/PostApi';
import Loader from '../../Utils/Loader';

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle password change
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (newPassword !== confirmPassword) {
      error_toaster('Passwords do not match!');
      return;
    }

    if (!newPassword || !confirmPassword) {
      error_toaster('Please fill in both password fields!');
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    try {
      // Make API request to reset the password
      const response = await PostApi('/admin/resetPassword', { userId, newPassword });

      if (response.data.status === "1") {
        success_toaster('Password has been reset successfully.');
        navigate('/sign-in'); // Redirect to login page after successful reset
      } else {
        error_toaster(response.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      error_toaster('An error occurred while resetting the password.');
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
                      <div className="login-userheading">
                        <h3>Set New Password</h3>
                        <h4>Enter your new password and confirm it.</h4>
                      </div>

                      <div className="form-login mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="form-login mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="form-login">
                        <button type="submit" className="btn btn-login">
                          Reset Password
                        </button>
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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LoginCheck } from "./AuthCheck";
import { useNavigate } from "react-router-dom";
import { purchasePlan, signinRoute } from "./routes";

export default function UserProtectedRoutes(props) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isPlan, setIsPlan] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const plan = localStorage.getItem("isPlan");
    if (role !== "user") {
      setIsAuthorized(false); // Unauthorized, set state
    }
    setIsPlan(plan);
  }, []);



  LoginCheck(); // Assuming this function has side effects and doesn’t affect rendering directly
  useEffect(() => {
    if (isPlan == "0") {
      navigate(purchasePlan);
    }
  });

  const logout = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("loginstatus");
    localStorage.removeItem("priceId");
    localStorage.removeItem("role");
    navigate(signinRoute)
}

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', // Stack content vertically
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <p>You don't have permission to access this page!</p>
        <button
        onClick={()=>logout()}
          className="btn btn-success"
          style={{
            marginTop: '20px', // Add space between the text and button
          }}
        >
          Logout
        </button>
      </div>
    );
  }
  
  

  const { Component } = props;
  return (
    <>
      <Component />
    </>
  );
}

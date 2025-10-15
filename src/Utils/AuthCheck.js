import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signinRoute } from "./routes";
// import { BASE_URL } from "./urls";
// import axios from "axios";
export const getLoginStatus = () => {
  const items = localStorage.getItem("loginstatus");
  return items;
};



export const setLoginStatus = (data) => {
  try {
    localStorage.setItem("loginstatus", data);
  } catch (err) {
    console.log(err);
  }
};

export const LoginCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getLoginStatus() === null || getLoginStatus() === "0") {
      navigate(signinRoute);
    }
  }, [navigate]);

  return null; // This hook does not render anything
};

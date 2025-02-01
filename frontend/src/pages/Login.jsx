import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/RegisterComponents.css";
import { RegisterComponents, INPUT } from "../components/RegisterComponents";

function Login() {
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000";

  const loginHandler = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
    }
  };
  return (
    <div className="register">
      <form onSubmit={loginHandler}>
        <RegisterComponents
          heading="Login"
          email={<INPUT type="email" id="email" placeholder="Email id" />}
          password={
            <INPUT type="password" id="password" placeholder="Password" />
          }
          action="Login"
          ask="Don't have an account?"
          linkto="/register"
          link="SignUp"
          customTextStyle={{ marginBottom: "75px" }}
        />
      </form>
    </div>
  );
}

export default Login;

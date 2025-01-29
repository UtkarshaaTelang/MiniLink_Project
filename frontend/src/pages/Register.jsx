import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/RegisterComponents.css";
import { RegisterComponents, INPUT } from "../components/RegisterComponents";

function Register() {
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5000/api/auth";

  const registerHandler = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("cpassword").value;

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    try {
      const response = await axios.post(`${API_BASE}/register`, {
        name,
        email,
        password,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message || "Registration failed");
    }
  };
  return (
    <div className="register">
      <form onSubmit={registerHandler}>
        <RegisterComponents
          heading="Join us Today!"
          name={<INPUT type="text" id="name" placeholder="Name" />}
          email={<INPUT type="email" id="email" placeholder="Email id" />}
          mobile={<INPUT type="number" id="mobile" placeholder="Mobile no." />}
          password={
            <INPUT type="password" id="password" placeholder="Password" />
          }
          confirm={
            <INPUT
              type="password"
              id="cpassword"
              placeholder="Confirm Password"
            />
          }
          action="Register"
          ask="Already have an account?"
          linkto="/login"
          link="Login"
        />
      </form>
    </div>
  );
}

export default Register;

{
  /* <div className="sections">
        <div className="leftsection">
          <img src={cuvettelogo} alt="logo" />
        </div>

        <div className="rightsection">
          <div className="buttons">
            <BUTTONS/>
          </div>

          <div className="placeholders">

            <div className="text">Join Us Today!</div>

            <input
              type="text"
              id="name"
              placeholder="Name"
              className="name-input"
            />

            <button className="register-button">Register</button>

            <div className="bottomtext">
              Already have an account? <a href="/login">Login</a>
            </div>
          </div>
        </div>
      </div> */
}

{
  /* <RegisterComponents heading="Join us Today!" action="Register" ask="Already have an account?" linkto="/login" link="Login"/> */
}
{
  /* <button className="signup">SignUp</button>
            <button className="login">Login</button> */
}

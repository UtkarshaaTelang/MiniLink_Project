import React from "react";
import { Link } from "react-router-dom";
import "./RegisterComponents.css";
import cuvettelogo from "../assets/download-2.png";

function RegisterComponents(props) {
  return (
    <>
      <div className="sections">
        <div className="leftsection">
          <img src={cuvettelogo} alt="logo" />
        </div>

        <div className="rightsection">
          <div className="buttons">
            <Link to='/register'><button className="signup">SignUp</button></Link>
            <Link to='/login'><button className="login">Login</button></Link>
          </div>

          <div className="placeholders">
            <div className="text" style={props.customTextStyle || {}}>{props.heading}</div>
            
            {props.name}
            {props.email}
            {props.mobile}
            {props.password}
            {props.confirm}

            <button className="register-button">{props.action}</button>

            <div className="bottomtext">
              {props.ask} <Link to={props.linkto}>{props.link}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { RegisterComponents };

function INPUT(props) {
  return (
    <input
      type={props.type}
      id={props.id}
      placeholder={props.placeholder}
      className="name-input"
    />
  );
}
export { INPUT };


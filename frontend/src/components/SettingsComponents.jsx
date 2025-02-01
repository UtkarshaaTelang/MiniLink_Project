import React from "react";
import "./SettingsComponents.css";

const SettingsForm = ({ label, type, name, placeholder, value, onChange }) => {
  return (
    <div>
      <div className="settings-compo">
        <label>{label}</label>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { SettingsForm };

const SettingsButton = ({ buttontxt, style, onClick }) => {
  return (
    <div className="settings-btns">
      <button style={style} onClick={onClick}>
        {buttontxt}
      </button>
    </div>
  );
};

export { SettingsButton };

const SettingsPopup = ({ ask, onClose, onConfirm }) => {
  return (
    <div className="settingspopup-container">
      <div className="settings-popup">
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>
        <div className="settingspopup-txt">{ask}</div>
        <div className="settingspopup-btn">
          <button style={{ backgroundColor: "#ECECEE" }} onClick={onClose}>
            No
          </button>
          <button
            style={{ backgroundColor: "#1B48DA", color: "#FFFFFF" }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export { SettingsPopup };

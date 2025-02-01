import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateNewPopup.css";
import { IoCalendarOutline } from "react-icons/io5";


const CreateNewPopup = ({
  onClose,
  title,
  buttontext,
  onAction,
  initialData,
}) => {
  const [destinationUrl, setDestinationUrl] = useState(
    initialData?.destinationUrl || ""
  );
  const [remarks, setRemarks] = useState(initialData?.remarks || "");
  const [linkExpiration, setLinkExpiration] = useState(
    initialData?.linkExpiration || ""
  );
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(
    !!initialData?.linkExpiration
  );
  const [errors, setErrors] = useState({
    destinationUrl: false,
    remarks: false,
  });

  console.log("Selected date:", linkExpiration);

  const handleSubmit = () => {
    const data = {
      destinationUrl,
      remarks,
      linkExpiration: isExpirationEnabled ? linkExpiration.toISOString() : null,
    };

    console.log("Data to be sent:", data);

    // Validate inputs
    if (!data.destinationUrl || !data.remarks) {
      setErrors({
        destinationUrl: !data.destinationUrl,
        remarks: !data.remarks,
      });
      return;
    }

    if (onAction) {
      onAction(data);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Header */}
        <div className="popup-header">
          <span className="popup-title">{title}</span>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="popup-content">
          {/* Destination URL */}
          <div className="input-group">
            <label>
              <span>
                Destination Url <span className="required">*</span>
              </span>
            </label>
            <input
              type="url"
              placeholder="https://web.whatsapp.com/"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className={errors.destinationUrl ? "input-error" : ""}
            />
            {errors.destinationUrl && (
              <div className="error-text">This field is mandatory</div>
            )}
          </div>

          {/* Remarks */}
          <div className="input-group">
            <label>
              <span>
                Remarks <span className="required">*</span>
              </span>
            </label>
            <textarea
              type="text"
              placeholder="Add remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={errors.remarks ? "input-error" : ""}
              // id="remarks"
            />
            {errors.remarks && (
              <div className="error-text">This field is mandatory</div>
            )}
          </div>

          {/* Link Expiration */}
          <div className="input-group">
            <label className="link-expiration-label">
              Link Expiration
              <div
                className={`toggle-switch ${
                  isExpirationEnabled ? "on" : "off"
                }`}
                onClick={() => setIsExpirationEnabled(!isExpirationEnabled)}
              >
                <div className="switch-handle"></div>
              </div>
            </label>
            <div className="expiration-container">
              <div className="date-picker-container">
                <ReactDatePicker
                  selected={linkExpiration}
                  onChange={(date) => setLinkExpiration(date)}
                  showTimeSelect
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select expiration date"
                  disabled={!isExpirationEnabled}
                  minDate={new Date()}
                  timeIntervals={1}
                  className="date-picker-input"
                  popperClassName="custom-datepicker-popper"
                />
                <IoCalendarOutline
                  className={`calendar-icon ${
                    isExpirationEnabled ? "active" : "disabled"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(".date-picker-input")?.focus();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="popup-footer">
          <span
            className="clear-button"
            onClick={() => {
              setDestinationUrl("");
              setRemarks("");
              setLinkExpiration("");
              setIsExpirationEnabled(false);
              setErrors({ destinationUrl: false, remarks: false });
            }}
          >
            Clear
          </span>
          <button className="create-button" onClick={handleSubmit}>
            {buttontext}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPopup;

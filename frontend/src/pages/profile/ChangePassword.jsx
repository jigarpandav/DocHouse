import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

import "./ChangePassword.css";
import apiAuth from "../../services/authService";
import brandLogo from "../../assets/images/logo.png";

const ChangePassword = () => {
  const adminId = localStorage.getItem("adminId");

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newError = {};

    if (oldPassword.trim().length === 0) {
      newError.oldPassword = "oldPassword is required"
    } 
    
    if (newPassword.trim().length === 0) {
      newError.newPassword = "newPassword is required"
    } else if (newPassword.trim().length < 8) {
      newError.newPassword = "Password must contain at least 8 characters."
    }else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)){
    newError.newPassword = "Password must include uppercase, lowercase, number, and special character"
  }

    if (confirmPassword.trim().length === 0) {
      newError.confirmPassword = "confirmPassword is required"
    } else if (confirmPassword.trim().length < 8) {
      newError.confirmPassword = "Password must contain at least 8 characters."
    }else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(confirmPassword)){
    newError.confirmPassword = "Password must include uppercase, lowercase, number, and special character"
  }

    if (newPassword.trim() !== confirmPassword.trim()) {
      newError.confirmPassword = "Password not match"
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    try {

      const res = await apiAuth("/change-password", {
        adminId,
        oldPassword,
        newPassword,
        confirmPassword
      })

      toast.success(res?.data?.message || "password change successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      )
    }
  };

  return (
    <section className="change-password-page page-wrapper">
      <div className="container-custom">

        <div className="change-password-wrapper theme-card theme-shadow fade-up">

          {/* Left */}

          <div className="change-password-left">

            <div className="change-password-logo">
              <img src={brandLogo} alt="Lexuniq" />
            </div>

            <span className="change-password-tag">
              ACCOUNT SECURITY
            </span>

            <h1>
              Change Your
              <br />
              <span>Password</span>
            </h1>

            <p>
              Protect your account by creating a strong password.
              Use a unique password that you don't use anywhere
              else.
            </p>

            <ul className="change-password-features">
              <li>✔ Secure Encryption</li>
              <li>✔ Strong Password Protection</li>
              <li>✔ Fast & Secure Update</li>
              <li>✔ Safe Account Access</li>
            </ul>

          </div>

          {/* Right */}

          <div className="change-password-right">

            <div className="change-password-header">

              <h2>Change Password</h2>

              <p>
                Update your account password securely.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Old Password */}

              <div className="input-group">

                <label>Old Password</label>

                <div className="password-box">

                  <FiLock className="left-icon" />

                  <input
                    type={
                      showPassword.oldPassword
                        ? "text"
                        : "password"
                    }
                    name="oldPassword"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      togglePassword("oldPassword")
                    }
                  >
                    {showPassword.oldPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
                {error.oldPassword && <small className="error-text">{error.oldPassword}</small>}
              </div>

              {/* New Password */}

              <div className="input-group">

                <label>New Password</label>

                <div className="password-box">

                  <FiLock className="left-icon" />

                  <input
                    type={
                      showPassword.newPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      togglePassword("newPassword")
                    }
                  >
                    {showPassword.newPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
                {error.newPassword && <small className="error-text">{error.newPassword}</small>}
              </div>

              {/* Confirm Password */}

              <div className="input-group">

                <label>Confirm Password</label>

                <div className="password-box">

                  <FiLock className="left-icon" />

                  <input
                    type={
                      showPassword.confirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      togglePassword("confirmPassword")
                    }
                  >
                    {showPassword.confirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
                {error.confirmPassword && <small className="error-text">{error.confirmPassword}</small>}
              </div>

              <button
                type="submit"
                className="change-password-btn theme-transition"
              >
                Update Password
              </button>

            </form>

            <Link
              to="/profile"
              className="back-profile-btn"
            >
              <FiArrowLeft />
              Back to Profile
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ChangePassword;
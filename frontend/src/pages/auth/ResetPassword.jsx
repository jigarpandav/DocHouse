import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

import "./ResetPassword.css";
import apiAuth from "../../services/authService";

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const {resetPasswordToken} = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {};

    if(newPassword.trim().length === 0){
      newError.newPassword = "newPassword is required"
    }else if(newPassword.trim().length < 8){
     newError.newPassword= "Password must contain at least 8 characters."
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)){
    newError.newPassword = "Password must include uppercase, lowercase, number, and special character"
  }

    if(confirmPassword.trim().length === 0){
      newError.confirmPassword = "confirmPassword is required"
    } else if(confirmPassword.trim().length < 8){
     newError.confirmPassword= "Password must contain at least 8 characters."
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(confirmPassword)){
    newError.confirmPassword = "Password must include uppercase, lowercase, number, and special character"
  }
    

    if(newPassword.trim() !== confirmPassword.trim()){
      newError.confirmPassword = "Password not match"
    }

    setError(newError);

    if(Object.keys(newError).length > 0) return;

    try{
      const res = await apiAuth.post(`/reset-password/${resetPasswordToken}`,
        {
          newPassword,
          confirmPassword
        }
      )

      toast.success(res.data.message || "Password reset successfully")
      
      setNewPassword("")
      setConfirmPassword("");
    
    }catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  };

  return (
    <section className="reset-page page-wrapper">

      <div className="container-custom">

        <div className="reset-wrapper theme-card theme-shadow fade-up">

          {/* Left Side */}

          <div className="reset-left">

            <div className="reset-logo">
              <FiShield size={38} />
            </div>

            <span className="reset-tag">
              PASSWORD SECURITY
            </span>

            <h1>
              Create a
              <br />
              <span>New Password</span>
            </h1>

            <p>
              Your new password should be strong and unique.
              Never reuse an old password and keep your account
              secure.
            </p>

            <ul className="reset-features">
              <li>✔ Secure Password Encryption</li>
              <li>✔ Strong Password Protection</li>
              <li>✔ Instant Account Recovery</li>
              <li>✔ Safe Login Experience</li>
            </ul>

          </div>

          {/* Right Side */}

          <div className="reset-right">

            <div className="reset-header">

              <h2>Reset Password</h2>

              <p>
                Create your new password to continue.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* New Password */}

              <div className="input-group">

                <label>New Password</label>

                <div className="password-box">

                  <FiLock className="left-icon" />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                  >
                    {showNewPassword ? (
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
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
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
                className="reset-btn theme-transition"
              >
                Reset Password
              </button>

            </form>

            <Link
              to="/login"
              className="back-login-btn"
            >
              <FiArrowLeft />
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ResetPassword;
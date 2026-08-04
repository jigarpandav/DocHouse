import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

import "./ForgotPassword.css";
import apiAuth from "../../services/authService";
import brandLogo from "../../assets/images/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();

    let newError = {};

    if(email.trim().length === 0){
      newError.email = "email is required";
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newError.email = "Enter a valid email address";
  }

  setError(newError);

  if(Object.keys(newError).length > 0) return

    
try {
  const res = await apiAuth.post("/forgot-password", {
    email,
  });

  toast.success(
    res.data.message || "Reset link sent successfully"
  );

  setEmail("");

  setTimeout(() => {
      navigate("/login")
    }, 2000);
} catch (error) {
  toast.error(
    error.response?.data?.message || "Something went wrong"
  );
}

  };

  return (
    <section className="forgot-page page-wrapper">

      <div className="container-custom">

        <div className="forgot-wrapper theme-card theme-shadow fade-up">

          {/* Left Side */}

          <div className="forgot-left">

            <div className="forgot-logo">
              <img src={brandLogo} alt="Lexuniq" />
            </div>

            <span className="forgot-tag">
              ACCOUNT RECOVERY
            </span>

            <h1>
              Forgot Your
              <br />
              <span>Password?</span>
            </h1>

            <p>
              Don't worry! Enter your registered email address and we'll send
              you a password reset link so you can securely access your account
              again.
            </p>

            <ul className="forgot-features">
              <li>✔ Secure Password Recovery</li>
              <li>✔ Email Verification</li>
              <li>✔ Fast & Safe Process</li>
              <li>✔ Protected Account Access</li>
            </ul>

          </div>

          {/* Right Side */}

          <div className="forgot-right">

            <div className="forgot-header">

              <h2>Forgot Password</h2>

              <p>
                Enter your registered email address.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <label>Email Address</label>

                <div className="input-icon">

                  <FiMail className="left-icon" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>
                {error.email && <small className="error-text">{error.email}</small>}

              </div>

              <button
                className="forgot-btn theme-transition"
                type="submit"
              >
                Send Reset Link
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

export default ForgotPassword;
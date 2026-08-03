import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { toast } from "react-toastify";

import "./Login.css";
import apiAuth from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember,setRemember] = useState();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {}

    if(email.trim().length === 0){
      newError.email = "Email is required"
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newError.email = "Enter a valid email address";
  }
  if(password.trim().length === 0){
    newError.password = "Password is required"
  }else if(password.trim().length < 8){
    newError.password = "Password must contain at least 8 characters."
  } 

  setError(newError);

  if(Object.keys(newError).length > 0) return;

  try{
    const res =  await apiAuth.post("/login",{
      email,
      password
    })
    localStorage.setItem("adminId",res.data.data);
    localStorage.setItem("accessToken", res.data.accessToken)

    toast.success(res.data.message || "admin login successfully");

    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/dashboard");
    },2000);

  } catch(error){
    toast.error(
          error.res?.data?.message || "Something went wrong"
        );
  }
    
  };

  return (
    <section className="login-page page-wrapper">

      <div className="container-custom">

        <div className="login-wrapper theme-card theme-shadow fade-up">

          {/* LEFT */}

          <div className="login-left">

            <div className="login-logo">
              <FiShield size={38} />
            </div>

            <span className="login-tag">
              LEGAL MANAGEMENT PLATFORM
            </span>

            <h1>
              Welcome Back
              <br />
              <span>Lexuniq</span>
            </h1>

            <p>
              Securely access your legal projects, document templates,
              clients, and business dashboard from anywhere.
            </p>

            <ul className="login-features">
              <li>✔ Secure Authentication</li>
              <li>✔ Case Management</li>
              <li>✔ Smart Templates</li>
              <li>✔ Cloud Document Storage</li>
            </ul>

          </div>

          {/* RIGHT */}

          <div className="login-right">

            <div className="login-header">

              <h2>Login</h2>

              <p>
                Sign in to continue your legal workflow.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className="input-group">

                <label>Email Address</label>

                <div className="input-icon">

                  <FiMail className="left-icon" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                   {error.email && <small className="error-text">{error.email}</small>}
                </div>

              </div>

              {/* Password */}

              <div className="input-group">

                <label>Password</label>

                <div className="password-box">

                  <FiLock className="left-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>
                     {error.password && <small className="error-text">{error.password}</small>}
              </div>

              {/* Remember */}

              <div className="login-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.value)}
                  />

                  <span>Remember Me</span>

                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                className="login-btn theme-transition"
                type="submit"
              >
                Login
              </button>

            </form>

            <div className="register-text">

              Don't have an account?

              <Link to="/register">
                Register
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Login;
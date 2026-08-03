import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import "./Register.css";
import apiAuth from "../../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [error,setError] = useState({});


const handleSubmit = async (e) => {
  e.preventDefault();

  let newError = {};

  // Name Validation
  if (name.trim() === "") {
    newError.name = "Name is required";
  } else if (name.trim().length < 3) {
    newError.name = "Name must be at least 3 characters.";
  }

  // Email Validation
  if (email.trim() === "") {
    newError.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newError.email = "Enter a valid email address";
  }

  // Password Validation
  if (password === "") {
    newError.password = "Password is required";
  } else if (password.length < 8) {
    newError.password = "Password must contain at least 8 characters.";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
    newError.password = "Password must include uppercase, lowercase, number, and special character"
  }

  setError(newError);

  if (Object.keys(newError).length > 0) return;

  try {
    const res = await apiAuth.post("/register", {
      admin_name:name,
      email,
      password,
    });

    toast.success(res.data.message || "Registration Successful!");
    

    // Clear Form
    setName("");
    setEmail("");
    setPassword("");
    setError({});

    setTimeout(() => {
      navigate("/login")
    }, 2000);
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <section className="register-page page-wrapper">

      <div className="container-custom">

        <div className="register-wrapper theme-card theme-shadow fade-up">

          {/* Left Side */}

          <div className="register-left">

            <div className="register-logo">
              <FiShield size={38} />
            </div>

            <span className="register-tag">
              LEGAL MANAGEMENT PLATFORM
            </span>

            <h1>
              Welcome to
              <br />
              <span>Lexuniq</span>
            </h1>

            <p>
              Simplify your legal workflow with secure document management,
              templates, client records and project tracking.
            </p>

            <ul className="register-features">
              <li>✔ Secure Cloud Storage</li>
              <li>✔ Document Templates</li>
              <li>✔ Client Management</li>
              <li>✔ Case & Project Tracking</li>
            </ul>

          </div>

          {/* Right Side */}

          <div className="register-right">

            <div className="register-header">

              <h2>Create Account</h2>

              <p>
                Create your account to start managing legal documents.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Name */}

              <div className="input-group">

                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {error.name && <small className="error-text">{error.name}</small>}

              </div>

              {/* Email */}

              <div className="input-group">

                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error.email && <small className="error-text">{error.email}</small>}

              </div>

              {/* Password */}

              <div className="input-group">

                <label>Password</label>

                <div className="password-box">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>

                  {error.password && <small className="error-text">{error.password}</small>}

                </div>

              </div>

              <button
                className="register-btn theme-transition"
                type="submit"
              >
                Create Account
              </button>

            </form>

            <div className="login-text">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Register;
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiHome,
  FiLock,
  FiX,
} from "react-icons/fi";

import "./ViewProfile.css";
import apiAuth from "../../services/authService";
import { useEffect } from "react";
import { useState } from "react";

const ViewProfile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  const adminId = localStorage.getItem("adminId");

  const getAdminData = () => {
    apiAuth.post("/get",{
      adminId
    }).then((res) => {
      if(res.status === 200){
        const json = res.data;
        // console.log(json.data)
        setAdminData(json.data)
       
        
      }
    })
  }
  
useEffect(() => {
  getAdminData();
},[]);


  const admin = {
    name: adminData?.admin_name ,
    email: adminData?.email ,
  };

  return (
    <section className="profile-page page-wrapper">

      <div className="container-custom">

        <div className="profile-wrapper theme-card theme-shadow fade-up">

          {/* Left Section */}

          <div className="profile-left">

            <div className="profile-logo">
              <FiShield size={40} />
            </div>

            <span className="profile-tag">
              MY ACCOUNT
            </span>

            <h1>
              Welcome
              <br />
              <span>{admin.name}</span>
            </h1>

            <p>
              Manage your personal profile, business
              information and account security from one place.
            </p>

            <ul className="profile-features">
              <li>✔ Secure Account</li>
              <li>✔ Manage Firm</li>
              <li>✔ Update Password</li>
              <li>✔ Professional Dashboard</li>
            </ul>

          </div>

          {/* Right Section */}

          <div className="profile-right">

            <div className="profile-header">

              <div className="profile-avatar">
               {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
              </div>

              <h2>{admin.name}</h2>

              <span>Administrator</span>

            </div>

            {/* Name */}

            <div className="profile-card">

              <div className="profile-icon">
                <FiUser />
              </div>

              <div>

                <label>Name</label>

                <h4>{admin.name}</h4>

              </div>

            </div>

            {/* Email */}

            <div className="profile-card">

              <div className="profile-icon">
                <FiMail />
              </div>

              <div>

                <label>Email</label>

                <h4>{admin.email}</h4>

              </div>

            </div>

            {/* Buttons */}

            <div className="profile-buttons">

              <Link
                to="/firm"
                className="profile-btn primary-btn"
              >
                <FiHome />
                View Firm
              </Link>

              <Link
                to="/change-password"
                className="profile-btn secondary-btn"
              >
                <FiLock />
                Change Password
              </Link>

                <Link
                to="/firm/create"
                className="profile-btn secondary-btn"
              >
                <FiLock />
                Create Firm
              </Link>

              <button
                className="profile-btn danger-btn"
                onClick={() => navigate(-1)}
              >
                <FiX />
                Close
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ViewProfile;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiBriefcase,
  FiEdit2,
  FiX,
  FiShield,
  FiCheckCircle,
  FiHome,
  FiHash
} from "react-icons/fi";

import "./FirmProfile.css";
import apiFirm from "../../services/firmService";
import apiAuth from "../../services/authService";

const FirmProfile = () => {

  const navigate = useNavigate();
  const [firmData, setFirmData] = useState({});
  const [adminData,setAdminData] = useState({})
  const adminId = localStorage.getItem("adminId")

   const IMGURL = import.meta.env.VITE_IMG_URL;
   const getImageUrl = (fileName) =>
     fileName ? `${IMGURL}/${fileName}?v=${encodeURIComponent(fileName)}` : "";

    useEffect(() => {

    apiFirm.post("/get", {
      adminId,
    })
    .then((res) => {

      if (res.status === 200) {

        setFirmData(res.data.data);
        console.log(res.data.data)

      }

    });

  }, [adminId]);

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

  // API Data

  const firm = {

    shopName: firmData?.shopName || "Legal Services",

    logo: firmData?.logo|| "firm logo",

    adminName: adminData?.admin_name || "Admin",

    email: adminData?.email,

    profession: firmData?.profession || "Advocate",

    primaryPhone: firmData?.primaryPhone,

    secondaryPhone: firmData?.secondaryPhone,

    tertiaryPhone: firmData?.tertiaryPhone,

    address: firmData?.address,

    city: firmData?.city ,

    state: firmData?.state,

    pincode: firmData?.pincode,

    upiId: firmData?.upiId,

    qrCode: firmData?.qrCode,

  };

  return (

    <section className="firm-profile-page page-wrapper">

      <div className="container-custom">

        {/* ==========================
              HERO CARD
        =========================== */}

        <div className="firm-hero theme-card theme-shadow">

          <div className="firm-hero-left">

            <div className="firm-logo-wrapper">

              <img

                 src={getImageUrl(firm.logo)}

                alt={firm.shopName}

                className="firm-logo"

              />

            </div>

            <div className="firm-hero-content">

              <div className="firm-badge">

                <FiCheckCircle />

                Verified Legal Firm

              </div>

              <h1>

                {firm.shopName}

              </h1>

              <p>

                {firm.profession}

              </p>

              <div className="firm-location">

                <FiMapPin />

                {firm.city}, {firm.state}

              </div>

            </div>

          </div>

          <div className="firm-hero-right">

            <Link

              to="/firm/update"

              className="update-firm-btn"

            >

              <FiEdit2 />

              Update Firm

            </Link>

          </div>

        </div>

        {/* ==========================
              STATS
        =========================== */}

        <div className="firm-stats">

          <div className="stat-card">

            <div className="stat-icon blue">

              <FiUser />

            </div>

            <div>

              <span>Administrator</span>

              <h3>

                {firm.adminName}

              </h3>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">

              <FiPhone />

            </div>

            <div>

              <span>Primary Phone</span>

              <h3>

                {firm.primaryPhone}

              </h3>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">

              <FiMail />

            </div>

            <div>

              <span>Email</span>

              <h3>

                {firm.email}

              </h3>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">

              <FiBriefcase />

            </div>

            <div>

              <span>Profession</span>

              <h3>

                {firm.profession}

              </h3>

            </div>

          </div>

        </div>

                {/* ==========================
              MAIN CONTENT
        =========================== */}

        <div className="firm-details-grid">

          {/* Business Information */}

          <div className="profile-section theme-card theme-shadow">

            <div className="section-header1">

              <FiHome />

              <h2>Business Information</h2>

            </div>

            <div className="section-body">

              <div className="detail-item">

                <div className="detail-icon">

                  <FiUser />

                </div>

                <div>

                  <label>Administrator</label>

                  <h4>{firm.adminName}</h4>

                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">

                  <FiBriefcase />

                </div>

                <div>

                  <label>Profession</label>

                  <h4>{firm.profession}</h4>

                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">

                  <FiHash />

                </div>

                <div>

                  <label>Pincode</label>

                  <h4>{firm.pincode}</h4>

                </div>

              </div>

            </div>

          </div>

          {/* Contact Information */}

          <div className="profile-section theme-card theme-shadow">

            <div className="section-header1">

              <FiPhone />

              <h2>Contact Information</h2>

            </div>

            <div className="section-body">

              <div className="detail-item">

                <div className="detail-icon">

                  <FiPhone />

                </div>

                <div>

                  <label>Primary Phone</label>

                  <h4>{firm.primaryPhone}</h4>

                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">

                  <FiPhone />

                </div>

                <div>

                  <label>Secondary Phone</label>

                  <h4>{firm.secondaryPhone || "-"}</h4>

                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">

                  <FiPhone />

                </div>

                <div>

                  <label>Third Phone</label>

                  <h4>{firm.tertiaryPhone || "-"}</h4>

                </div>

              </div>

              <div className="detail-item">

                <div className="detail-icon">

                  <FiMail />

                </div>

                <div>

                  <label>Email Address</label>

                  <h4>{firm.email}</h4>

                </div>

              </div>

            </div>

          </div>

          {/* Address */}

          <div className="profile-section theme-card theme-shadow">

            <div className="section-header1">

              <FiMapPin />

              <h2>Office Address</h2>

            </div>

            <div className="section-body">

              <div className="address-box">

                <h3>{firm.address}</h3>

                <p>

                  {firm.city},

                  {" "}

                  {firm.state}

                  {" - "}

                  {firm.pincode}

                </p>

              </div>

            </div>

          </div>

          {/* Payment */}

          <div className="profile-section theme-card theme-shadow">

            <div className="section-header1">

              <FiCreditCard />

              <h2>Payment Information</h2>

            </div>

            <div className="section-body">

              <div className="upi-box">

                <label>UPI ID</label>

                <h3>{firm.upiId}</h3>

              </div>

              <div className="qr-wrapper">

                <img

                   src={getImageUrl(firm.qrCode)}

                  alt="QR"

                  className="qr-image"

                />

              </div>

            </div>

          </div>

        </div>

        {/* ==========================
              ACTIONS
        =========================== */}

        <div className="firm-footer-actions">

          <Link

            to="/firm/update"

            className="update-firm-btn large"

          >

            <FiEdit2 />

            Update Firm

          </Link>

          <button

            className="close-btn"

            onClick={() => navigate(-1)}

          >

            <FiX />

            Close

          </button>

        </div>

      </div>

    </section>

  );

};

export default FirmProfile;

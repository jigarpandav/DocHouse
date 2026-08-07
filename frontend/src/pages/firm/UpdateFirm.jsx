import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiImage,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";


import "./UpdateFirm.css";
import apiFirm from "../../services/firmService";
import apiAuth from "../../services/authService";
import Input from "../../components/common/Input";

const UpdateFirm = () => {
  const navigate = useNavigate();
  const [adminName,setAdminName] =useState("");
  const [email,setEmail] = useState("");
  const [shopName,setShopName] = useState("");
  const [primaryPhone,setPrimaryPhone] = useState("");
  const [secondaryPhone,setSecondaryPhone] = useState("");
  const [profession,setProfession] = useState("");
  const [tertiaryPhone,setTertiaryPhone] = useState("");
  const [address,setAddress] = useState("")
  const [city,setCity] = useState("");
  const [state,setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [upiId,setUpiId] = useState("");
  const [logo,setLogo] = useState("");
  const [qrCode,setQrCode] = useState("");
  const [error,setError] = useState({});
  const [firmData, setFirmData] = useState({});
  const [logoPreview, setLogoPreview] = useState("");
const [qrPreview, setQrPreview] = useState("");
  const firmId = firmData._id;
  const isFile = (value) => value instanceof File;

  const adminId = localStorage.getItem("adminId")


    const IMGURL = import.meta.env.VITE_IMG_URL || `${window.location.origin}/uploads`;

       useEffect(() => {

    apiAuth.post("/get", {
      adminId,
    })
    .then((res) => {

      if (res.status === 200) {
          const json = res.data.data
        setAdminName(json.admin_name);
        setEmail(json.email)
        

      }

    });

  }, []);

    useEffect(() => {

    apiFirm.post("/get", {
      adminId,
    })
    .then((res) => {

      if (res.status === 200) {
          const json = res.data.data;
          setFirmData(json)
          setShopName(json.shopName);
          setPrimaryPhone(json.primaryPhone);
          setSecondaryPhone(json.secondaryPhone);
          setTertiaryPhone(json.tertiaryPhone);
          setProfession(json.profession);
          setPincode(json.pincode);
          setAddress(json.address);
          setState(json.state);
          setCity(json.city);
          setUpiId(json.upiId);
          setLogo(json.logo);
          setQrCode(json.qrCode);
          setLogoPreview(json.logo ? `${IMGURL.replace(/\/$/, "")}/${json.logo}` : "");

setQrPreview(json.qrCode ? `${IMGURL.replace(/\/$/, "")}/${json.qrCode}` : "");

      }

    });

  }, [adminId]);

  const handleFile = (e) => {
  const { name, files } = e.target;

  if (!files || !files[0]) return;

  const file = files[0];

  if (name === "logo") {
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  if (name === "qrCode") {
    setQrCode(file);
    setQrPreview(URL.createObjectURL(file));
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  let newError = {};

  // Shop Name
  if (!shopName.trim()) {
    newError.shopName = "Shop name is required.";
  } else if (shopName.trim().length < 3) {
    newError.shopName = "Shop name must be at least 3 characters.";
  }

  // Primary Phone
  if (!primaryPhone.trim()) {
    newError.primaryPhone = "Primary phone is required.";
  } else if (!/^[6-9]\d{9}$/.test(primaryPhone.trim())) {
    newError.primaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Secondary Phone (Optional)
  if (
    secondaryPhone.trim() &&
    !/^[6-9]\d{9}$/.test(secondaryPhone.trim())
  ) {
    newError.secondaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Tertiary Phone (Optional)
  if (
    tertiaryPhone.trim() &&
    !/^[6-9]\d{9}$/.test(tertiaryPhone.trim())
  ) {
    newError.tertiaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Address
  if (!address.trim()) {
    newError.address = "Address is required.";
  } else if (address.trim().length < 5) {
    newError.address = "Address must be at least 5 characters.";
  }

  // City
  if (!city.trim()) {
    newError.city = "City is required.";
  }

  // State
  if (!state.trim()) {
    newError.state = "State is required.";
  }

  // Pincode
  if (!pincode.trim()) {
    newError.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(pincode.trim())) {
    newError.pincode = "Pincode must be 6 digits.";
  }

  // Profession
  if (!profession.trim()) {
    newError.profession = "Profession is required.";
  }

  // UPI ID (Optional)
  if (
    upiId.trim() &&
    !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())
  ) {
    newError.upiId = "Enter a valid UPI ID.";
  }

  // Logo Validation
  if (isFile(logo)) {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!validTypes.includes(logo.type)) {
      newError.logo = "Logo must be JPG, PNG or WEBP.";
    } else if (logo.size > 2 * 1024 * 1024) {
      newError.logo = "Logo size must be less than 2MB.";
    }
  }

  // QR Code Validation
  if (isFile(qrCode)) {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!validTypes.includes(qrCode.type)) {
      newError.qrCode = "QR Code must be JPG, PNG or WEBP.";
    } else if (qrCode.size > 2 * 1024 * 1024) {
      newError.qrCode = "QR Code size must be less than 2MB.";
    }
  }

  // Duplicate Phone Numbers
  if (
    secondaryPhone &&
    primaryPhone === secondaryPhone
  ) {
    newError.secondaryPhone =
      "Secondary phone cannot be the same as Primary phone.";
  }

  if (
    tertiaryPhone &&
    (tertiaryPhone === primaryPhone ||
      tertiaryPhone === secondaryPhone)
  ) {
    newError.tertiaryPhone =
      "Tertiary phone must be different from other phone numbers.";
  }

  // Show Errors
  setError(newError);

  if (Object.keys(newError).length > 0) {
    return;
  }

  try {
    const formData = new FormData();

    formData.append("firmId", firmId);
    formData.append("adminId", adminId);
    formData.append("shopName", shopName.trim());
    formData.append("primaryPhone", primaryPhone.trim());
    formData.append("secondaryPhone", secondaryPhone.trim());
    formData.append("tertiaryPhone", tertiaryPhone.trim());
    formData.append("address", address.trim());
    formData.append("city", city.trim());
    formData.append("state", state.trim());
    formData.append("pincode", pincode.trim());
    formData.append("upiId", upiId.trim());
    formData.append("profession", profession.trim());

    if (isFile(logo)) {
      formData.append("logo", logo);
    }

    if (isFile(qrCode)) {
      formData.append("qrCode", qrCode);
    }

    const res = await apiFirm.put("/update", formData);

    toast.success(
      res?.data?.message || "Firm updated successfully."
    );
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Something went wrong."
    );
  }
};



  return (
    <section className="update-firm-page page-wrapper">

      <div className="container-custom">

        {/* Header */}

        <div className="update-header">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Back
          </button>

          <button
            className="save-top-btn"
            onClick={handleSubmit}
          >
            <FiSave />
            Save Changes
          </button>

        </div>

        {/* Hero */}

        <div className="update-hero theme-shadow">

          <div>

            <span className="hero-badge">
              <FiShield />
              Firm Settings
            </span>

            <h1>Update Firm Profile</h1>

            <p>
              Keep your legal firm's information accurate and
              up to date. This information will appear on
              templates, documents, invoices and client records.
            </p>

          </div>

        </div>

        {/* Upload Cards */}

        <div className="upload-section">

          {/* Logo */}

          <div className="upload-card theme-card theme-shadow">

            <div className="upload-title">

              <FiImage />

              <h3>Firm Logo</h3>

            </div>

          <div className="upload-preview">
  {logoPreview ? (
    <img
      src={logoPreview}
      alt="Logo"
    />
  ) : (
    <div className="upload-placeholder">
      <FiImage />
      <span>No Logo</span>
    </div>
  )}


</div>
{error.logo && <small className="error-text">{error.logo}</small>}

          
    <label className="upload-button">

              <FiUpload />

               logo

              <input
                hidden
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleFile}
              />

            </label>

          </div>

          {/* QR */}

         <div className="upload-card theme-card theme-shadow">

            <div className="upload-title">

              <FiCreditCard />

              <h3>Payment QR Code</h3>

            </div>

            <div className="upload-preview">

              {qrPreview ? (

                <img
                  src={qrPreview}
                  alt="QR"
                />

              ) : (

                <div className="upload-placeholder">

                  <FiCreditCard />

                  <span>No QR Code</span>

                </div>

              )}

            </div>

            <label className="upload-button">

              <FiUpload />

              Upload QR

              <input
                hidden
                type="file"
                name="qrCode"
                accept="image/*"
                onChange={handleFile}
              />

            </label>

          </div>
{error.qrCode && <small className="error-text">{error.qrCode}</small>}
        </div>

        {/* Continue with Business Information in Part 2 */}
                {/* ==========================
              FORM
        ========================== */}

        <form
          className="update-form"
          onSubmit={handleSubmit}
        >

          {/* Business Information */}

          <div className="form-card theme-card theme-shadow">

            <div className="card-header">

              <h2>Business Information</h2>

              <p>Basic details about your legal firm.</p>

            </div>

            <div className="form-grid">

               <Input
label="Firm / Shop Name"
placeholder="Enter Firm Name"
value={shopName}
onChange={(e)=>setShopName(e.target.value)}
/> 
{error.shopName && <small className="error-text">{error.shopName}</small>}

               <Input
label="Profession"
placeholder="Enter profession"
value={profession}
onChange={(e)=>setProfession(e.target.value)}
/>            
{error.profession && <small className="error-text">{error.profession}</small>}

               <Input
label="Administrator Name"
value={adminName}
readOnly
/> 

               <Input
label="email"
placeholder="Enter Email Address"
value={email}
readOnly
/> 

            </div>

          </div>

          {/* Contact Information */}

          <div className="form-card theme-card theme-shadow">

            <div className="card-header">

              <h2>Contact Information</h2>

              <p>Phone numbers that clients can use.</p>

            </div>

            <div className="form-grid">


                             <Input
label="Primary Phone"
placeholder="Enter primary phone"
value={primaryPhone}
onChange={(e)=>setPrimaryPhone(e.target.value)}
/> 
{error.primaryPhone && <small className="error-text">{error.primaryPhone}</small>}

                             <Input
label="Secondary Phone"
placeholder="Enter Secondary Phone"
value={secondaryPhone}
onChange={(e)=>setSecondaryPhone(e.target.value)}
/> 
{error.secondaryPhone && <small className="error-text">{error.secondaryPhone}</small>}

                             <Input
label="Tertiary Phone"
placeholder="Enter tertiaryPhone"
value={tertiaryPhone}
onChange={(e)=>setTertiaryPhone(e.target.value)}
/> 
{error.tertiaryPhone && <small className="error-text">{error.tertiaryPhone}</small>}


                             <Input
label="UPI ID"
placeholder="Enter upi id"
value={upiId}
onChange={(e)=>setUpiId(e.target.value)}
/> 
{error.upiId && <small className="error-text">{error.upiId}</small>}
            </div>

          </div>

          {/* Office Address */}

          <div className="form-card theme-card theme-shadow">

            <div className="card-header">

              <h2>Office Address</h2>

              <p>Displayed on legal documents and invoices.</p>

            </div>

            <div className="form-grid">

              <div className="form-group full-width">

                <label>Office Address</label>

                <textarea

                  rows={4}

                  name="address"

                  value={address}

                  onChange={(e) => setAddress(e.target.value)}

                  placeholder="Enter complete office address"

                />
{error.address && <small className="error-text">{error.address}</small>}
              </div>


                                           <Input
label="City"
placeholder="Enter City"
value={city}
onChange={(e)=>setCity(e.target.value)}
/> 
{error.city && <small className="error-text">{error.city}</small>}

                                           <Input
label="State"
placeholder="Enter state"
value={state}
onChange={(e)=>setState(e.target.value)}
/> 
{error.state && <small className="error-text">{error.state}</small>}

                                           <Input
label="Pincode"
placeholder="Enter pincode"
value={pincode}
onChange={(e)=>setPincode(e.target.value)}
/> 
{error.pincode && <small className="error-text">{error.pincode}</small>}
            </div>

          </div>

          {/* Bottom Buttons */}

          <div className="bottom-actions">

            <Link
              to="/firm"
              className="btn-secondary"
            >
              Cancel
            </Link>

            <button

              type="button"

              className="btn-danger"

              onClick={() => navigate(-1)}

            >

              Close

            </button>

            <button

              type="submit"

              className="btn-primary"

            >

              <FiSave />

              Save Changes

            </button>

          </div>

        </form>

      </div>

    </section>

  );

};

export default UpdateFirm;

import React, { useState } from "react";
import { FiUpload, FiImage, FiCreditCard } from "react-icons/fi";
import "./CreateFirm.css";
import apiFirm from "../../services/firmService";
import { toast } from "react-toastify";

const CreateFirm = () => {

  const adminId = localStorage.getItem("adminId");

  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");
  const [error,setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    profession: "",
    primaryPhone: "",
    secondaryPhone: "",
    tertiaryPhone: "",
    upiId: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= FILE =================
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "logo") {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }

    if (e.target.name === "qr") {
      setQrCode(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  // ================= SUBMIT =================
const handleSubmit = async () => {
  console.log("handle click")
  const newError = {};
  console.log("name", form)

  // Shop Name
  if (!form.shopName.trim()) {
    newError.shopName = "Shop name is required.";
  } else if (form.shopName.trim().length < 3) {
    newError.shopName = "Shop name must be at least 3 characters.";
  }

  // Profession
  if (!form.profession.trim()) {
    newError.profession = "Profession is required.";
  }

  // Primary Phone
  if (!form.primaryPhone.trim()) {
    newError.primaryPhone = "Primary phone is required.";
  } else if (!/^[6-9]\d{9}$/.test(form.primaryPhone)) {
    newError.primaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Secondary Phone (Optional)
  if (
    form.secondaryPhone &&
    !/^[6-9]\d{9}$/.test(form.secondaryPhone)
  ) {
    newError.secondaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Tertiary Phone (Optional)
  if (
    form.tertiaryPhone &&
    !/^[6-9]\d{9}$/.test(form.tertiaryPhone)
  ) {
    newError.tertiaryPhone = "Enter a valid 10-digit mobile number.";
  }

  // Duplicate Phone Numbers
  if (
    form.secondaryPhone &&
    form.secondaryPhone === form.primaryPhone
  ) {
    newError.secondaryPhone =
      "Secondary phone cannot be the same as Primary phone.";
  }

  if (
    form.tertiaryPhone &&
    (form.tertiaryPhone === form.primaryPhone ||
      form.tertiaryPhone === form.secondaryPhone)
  ) {
    newError.tertiaryPhone =
      "Tertiary phone must be different from other phone numbers.";
  }

  // UPI ID (Optional)
  if (
    form.upiId &&
    !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(form.upiId)
  ) {
    newError.upiId = "Enter a valid UPI ID.";
  }

  // Address
  if (!form.address.trim()) {
    newError.address = "Address is required.";
  } else if (form.address.trim().length < 5) {
    newError.address = "Address must be at least 5 characters.";
  }

  // City
  if (!form.city.trim()) {
    newError.city = "City is required.";
  }

  // State
  if (!form.state.trim()) {
    newError.state = "State is required.";
  }

  // Pincode
  if (!form.pincode.trim()) {
    newError.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(form.pincode)) {
    newError.pincode = "Pincode must be a valid 6-digit number.";
  }

  // Logo Validation
  if (logo instanceof File) {
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
  if (qrCode instanceof File) {
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

  // Set Errors
  setError(newError);

  // Stop if validation fails
  if (Object.keys(newError).length > 0) {
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("adminId", adminId);
    formData.append("shopName", form.shopName.trim());
    formData.append("profession", form.profession.trim());
    formData.append("primaryPhone", form.primaryPhone.trim());
    formData.append("secondaryPhone", form.secondaryPhone.trim());
    formData.append("tertiaryPhone", form.tertiaryPhone.trim());
    formData.append("upiId", form.upiId.trim());
    formData.append("address", form.address.trim());
    formData.append("city", form.city.trim());
    formData.append("state", form.state.trim());
    formData.append("pincode", form.pincode.trim());

    if (logo instanceof File) {
      formData.append("logo", logo);
    }

    if (qrCode instanceof File) {
      formData.append("qrCode", qrCode);
    }

    const res = await apiFirm.post("/create", formData);
      
    toast.success(res?.data?.message || "Firm created successfully");
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Something went wrong."
      
    );
    
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="firm-page">
      <div className="container">

        {/* TOP CARDS */}
        <div className="top-grid">

          {/* LOGO */}
          <div className="card">
            <h3><FiImage /> Firm Logo</h3>
            <div className="upload-box">
              {logoPreview ? <img src={logoPreview} alt="" /> : "No Logo"}
            </div>
            <label className="upload-btn">
              <FiUpload /> Upload Logo
              <input type="file" name="logo" onChange={handleFile} hidden />
            </label>
          </div>
{error.logo && <small className="error-text">{error.logo}</small>}
          {/* QR */}
          <div className="card">
            <h3><FiCreditCard /> Payment QR Code</h3>
            <div className="upload-box">
              {qrPreview ? <img src={qrPreview} alt="" /> : "No QR"}
            </div>
            <label className="upload-btn">
              <FiUpload /> Upload QR
              <input type="file" name="qr" onChange={handleFile} hidden />
            </label>
          </div>
{error.qrCode && <small className="error-text">{error.qrCode}</small>}
        </div>

        {/* BUSINESS INFO */}
        <div className="card">
          <h3>Business Information</h3>
          <div className="grid-2">
            <input name="shopName" placeholder="Firm / Shop Name" onChange={handleChange} />
            {error.shopName && <small className="error-text">{error.shopName}</small>}
            <input name="profession" placeholder="Profession" onChange={handleChange} />
            {error.profession && <small className="error-text">{error.profession}</small>}

          
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="card">
          <h3>Contact Information</h3>
          <div className="grid-2">
            <input name="primaryPhone" placeholder="Primary Phone" onChange={handleChange} />
            {error.primaryPhone && <small className="error-text">{error.primaryPhone}</small>}
            <input name="secondaryPhone" placeholder="Secondary Phone" onChange={handleChange} />
            {error.secondaryPhone && <small className="error-text">{error.secondaryPhone}</small>}
            <input name="tertiaryPhone" placeholder="Tertiary Phone" onChange={handleChange} />
            {error.tertiaryPhone && <small className="error-text">{error.tertiaryPhone}</small>}
            <input name="upiId" placeholder="UPI ID" onChange={handleChange} />
            {error.upiId && <small className="error-text">{error.upiId}</small>}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="card">
          <h3>Office Address</h3>

          <textarea
            name="address"
            placeholder="Office Address"
            onChange={handleChange}
          />

          {error.address && <small className="error-text">{error.address}</small>}

          <div className="grid-3">
            <input name="city" placeholder="City" onChange={handleChange} />
            {error.city && <small className="error-text">{error.city}</small>}
            <input name="state" placeholder="State" onChange={handleChange} />
            {error.state && <small className="error-text">{error.state}</small>}
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
            {error.pincode && <small className="error-text">{error.pincode}</small>}
          </div>
        </div>

        {/* BUTTON */}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Firm"}
        </button>

      </div>
    </div>
  );
};

export default CreateFirm;
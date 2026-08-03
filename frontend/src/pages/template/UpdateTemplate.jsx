import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiMenu,
  FiX,
  FiSave,
} from "react-icons/fi";

import "./UpdateTemplate.css";

import apiCat from "../../services/cateService";
import apiTemp from "../../services/templateService";

import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";

const UpdateTemplate = () => {

  const navigate = useNavigate();

  const { templateId } = useParams();

  const adminId = localStorage.getItem("adminId");

  /* ===========================
            STATES
  =========================== */

  const [categoryId, setCategoryId] = useState("");

  const [categoryData, setCategoryData] = useState([]);

  const [title, setTitle] = useState("");

  const [documentName, setDocumentName] = useState("");

  const [requiredDoc, setRequiredDoc] = useState([]);

  const [docIndex, setDocIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({});



  /* ===========================
        GET TEMPLATE DATA
  =========================== */

  const getTemplateData = async () => {

    try {

      const res = await apiTemp.post("/get", {

        templateId,

      });

      if (res.status === 200) {

        const json = res.data.data;

        setCategoryId(json.categoryId);

        setTitle(json.title);

        setRequiredDoc(json.required_documents || []);

      }

    } catch (err) {

      console.log(err);

      toast.error("Unable to load template.");

    }

  };



  /* ===========================
        GET CATEGORY DATA
  =========================== */

  const getAllCategoryData = async () => {

    try {

      const res = await apiCat.post("/get-all", {

        adminId,

      });

      if (res.status === 200) {

        setCategoryData(res.data.data || []);

      }

    } catch (err) {

      console.log(err);

      toast.error("Unable to load categories.");

    }

  };



  /* ===========================
            USE EFFECT
  =========================== */

  useEffect(() => {

    if (adminId) {

      getAllCategoryData();

    }

  }, [adminId]);



  useEffect(() => {

    if (templateId) {

      getTemplateData();

    }

  }, [templateId]);

    /* ===========================
          VALIDATION
  =========================== */

  const validateForm = () => {

    const newError = {};

    if (!categoryId) {
      newError.categoryId = "Category is required.";
    }

    if (title.trim().length < 3) {
      newError.title =
        "Title must be at least 3 characters.";
    }

    if (requiredDoc.length === 0) {
      newError.requiredDoc =
        "Please add at least one required document.";
    }

    setError(newError);

    return Object.keys(newError).length === 0;

  };



  /* ===========================
        ADD / UPDATE DOCUMENT
  =========================== */

  const addDocument = () => {

    const name = documentName.trim();

    if (name.length < 3) {
      return toast.error(
        "Document name must be at least 3 characters."
      );
    }

    if (docIndex !== null) {

      const updateDoc = [...requiredDoc];

      updateDoc[docIndex] = name;

      setRequiredDoc(updateDoc);

      setDocIndex(null);

      toast.success("Document updated successfully.");

    } else {

      setRequiredDoc([
        ...requiredDoc,
        name,
      ]);

      toast.success("Document added successfully.");

    }

    setDocumentName("");

  };



  /* ===========================
          EDIT DOCUMENT
  =========================== */

  const handleUpdate = (index) => {

    setDocumentName(requiredDoc[index]);

    setDocIndex(index);

  };



  /* ===========================
        DELETE DOCUMENT
  =========================== */

  const handleDelete = (index) => {

    const updatedDocs = requiredDoc.filter(
      (_, i) => i !== index
    );

    setRequiredDoc(updatedDocs);

    if (docIndex === index) {

      setDocIndex(null);

      setDocumentName("");

    }

    toast.success("Document removed.");

  };



  /* ===========================
        UPDATE TEMPLATE
  =========================== */

  const handleUpdateTemplate = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      const res = await apiTemp.put("/update", {

        templateId,

        adminId,

        categoryId,

        title,

        required_documents: requiredDoc,

      });

      toast.success(
        res.data.message ||
        "Template updated successfully."
      );

      navigate("/templates");

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  };



  /* ===========================
            CANCEL
  =========================== */

  const handleCancel = () => {

    navigate("/templates");

  };


  return (
  <div className="template-page">

    <div className="template-card">

      {/* ================= HEADER ================= */}

      <div className="card-header">

        <div className="header-left">

          <div className="small-icon">
            <FiFileText />
          </div>

          <div>

            <h3>Update Template</h3>

            <p>
              Update template information and required documents.
            </p>

          </div>

        </div>

      </div>

      <hr />

      {/* ================= FORM ================= */}

      <div className="form-row">

        {/* Category */}

        <div className="form-group">

          <label>
            Category <span>*</span>
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >

            <option value="">
              Select Category
            </option>

            {categoryData.length > 0 ? (

              categoryData.map((item) => (

                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>

              ))

            ) : (

              <option
                value=""
                disabled
              >
                No Category Found
              </option>

            )}

          </select>

          {error.categoryId && (
            <small className="error-text">
              {error.categoryId}
            </small>
          )}

        </div>

        {/* Title */}

        <div className="form-group">

          <label>
            Title <span>*</span>
          </label>

          <input
            type="text"
            placeholder="Enter Template Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {error.title && (
            <small className="error-text">
              {error.title}
            </small>
          )}

        </div>

      </div>

      {/* ================= DOCUMENT SECTION ================= */}

      <div className="document-section">

        <label>
          Required Documents <span>*</span>
        </label>

        <div className="document-input">

          <input
            type="text"
            placeholder="Enter document name"
            value={documentName}
            onChange={(e) =>
              setDocumentName(e.target.value)
            }
          />

          <button
            type="button"
            className="add-btn"
            onClick={addDocument}
          >

            <FiPlus />

            {docIndex === null
              ? "Add Document"
              : "Update Document"}

          </button>

        </div>

        {error.requiredDoc && (
          <small className="error-text">
            {error.requiredDoc}
          </small>
        )}

        <div className="document-list">

          {requiredDoc.length > 0 ? (

  requiredDoc.map((doc, index) => (

    <div
      className="document-item"
      key={index}
    >

      <div className="doc-left">

        <FiMenu />

        <span>{doc}</span>

      </div>

      <div className="doc-action">

        <button
          type="button"
          className="edit-btn"
          onClick={() => handleUpdate(index)}
        >
          <FiEdit2 />
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => handleDelete(index)}
        >
          <FiTrash2 />
        </button>

      </div>

    </div>

  ))

) : (

  <div
    style={{
      padding: "35px",
      textAlign: "center",
      color: "#999",
      fontWeight: "500",
    }}
  >
    No Required Documents Added
  </div>

)}

        </div>

        <div className="note">
          ℹ Update the required documents for this template.
        </div>

      </div>

      <hr />

      {/* ================= FOOTER ================= */}

      <div className="card-footer">

        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancel}
        >
          <FiX />
          Cancel
        </button>

        <button
          type="button"
          className="save-btn"
          onClick={handleUpdateTemplate}
          disabled={loading}
        >
          <FiSave />

          {loading
            ? "Updating..."
            : "Update Template"}

        </button>

      </div>

    </div>

  </div>
);

};

export default UpdateTemplate;
       
import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiSave,
  FiMenu,
} from "react-icons/fi";

import "./CreateTemplate.css";
import apiCat from "../../services/cateService";
import apiTemp from "../../services/templateService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const navigate = useNavigate();

  const adminId = localStorage.getItem("adminId");

  const [categoryId, setCategoryId] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  const [title, setTitle] = useState("");

  const [documentName, setDocumentName] = useState("");

  const [requiredDoc, setRequiredDoc] = useState([]);

  const [docIndex, setDocIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({});




  /* ===========================
          GET CATEGORY
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


  useEffect(() => {

    if (adminId) {
      getAllCategoryData();
    }

  }, []);




  /* ===========================
        VALIDATION
  =========================== */

  const validateForm = () => {

    let newError = {};

    if (!categoryId) {
      newError.categoryId = "Category is required";
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

      toast.error(
        "Document name must be at least 3 characters."
      );

      return;
    }


    if (docIndex !== null) {

      const updateDoc = [...requiredDoc];

      updateDoc[docIndex] = name;

      setRequiredDoc(updateDoc);

      setDocIndex(null);

    } else {

      setRequiredDoc([...requiredDoc, name]);


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

    const filterDoc = requiredDoc.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setRequiredDoc(filterDoc);

    if (docIndex === index) {

      setDocumentName("");

      setDocIndex(null);

    }

    toast.success("Document removed.");

  };





  /* ===========================
      CREATE TEMPLATE
  =========================== */

  const handleSubmit = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      const res = await apiTemp.post("/create", {

        adminId,

        categoryId,

        title,

        required_documents: requiredDoc,

      });

      toast.success(
        res.data.message ||
          "Template created successfully."
      );

      setCategoryId("");

      setTitle("");

      setRequiredDoc([]);

      setDocumentName("");

      setDocIndex(null);

      setTimeout(() => {

        navigate("/templates");

      }, 1000);

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

      {/* ================= Header ================= */}

      <div className="card-header">
        <div className="header-left">

          <div className="small-icon">
            <FiFileText />
          </div>

          <div>
            <h3>Create Template</h3>

            <p>
              Add a new template and its required documents.
            </p>
          </div>

        </div>
      </div>

      <hr />

      {/* ================= Form ================= */}

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
            <option value="">Select Category</option>

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
              <option value="" disabled>
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
            onChange={(e) => setTitle(e.target.value)}
          />

          {error.title && (
            <small className="error-text">
              {error.title}
            </small>
          )}

        </div>

      </div>

      {/* ================= Required Documents ================= */}

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

            {docIndex !== null
              ? "Update Document"
              : "Add Document"}
          </button>

        </div>

        {error.requiredDoc && (
          <small className="error-text">
            {error.requiredDoc}
          </small>
        )}

        {/* ================= Document List ================= */}

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

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  {/* Edit */}

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                      handleUpdate(index)
                    }
                  >
                    Edit
                  </button>

                  {/* Delete */}

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(index)
                    }
                  >
                    <FiTrash2 />
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div
              style={{
                textAlign: "center",
                padding: "35px",
                color: "#999",
              }}
            >
              No Required Documents Added
            </div>

          )}

        </div>

        <div className="note">
          ℹ Add all documents that are required for this
          template.
        </div>

      </div>

      <hr />

      {/* ================= Footer ================= */}

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
          onClick={handleSubmit}
          disabled={loading}
        >
          <FiSave />

          {loading
            ? "Creating..."
            : "Create Template"}
        </button>

      </div>

    </div>
  </div>
);

}

export default CreateTemplate;
import React, { useEffect, useState } from "react";
import {
  FiFolder,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import apiCat from "../../services/cateService";

import ConfirmationModal from "../../components/common/ConfirmationModal";

import "./ViewCategory.css";

const ViewCategory = () => {

  const adminId = localStorage.getItem("adminId");

  /* ===========================
            STATES
  =========================== */

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [categoryId, setCategoryId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [modalType, setModalType] = useState("");


  /* ===========================
        GET CATEGORY DATA
  =========================== */

  const getCategories = async () => {

    try {

      setLoading(true);

      const res = await apiCat.post("/get-all", {

        adminId,

      });

      if (res.status === 200) {

        setCategories(res.data.data || []);

      }

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Unable to fetch categories."
      );

    } finally {

      setLoading(false);

    }

  };



  /* ===========================
          USE EFFECT
  =========================== */

  useEffect(() => {

    if (adminId) {

      getCategories();

    }

  }, [adminId]);
    /* ===========================
          SEARCH
  =========================== */

 const filteredCategories = categories.filter((item) =>
  (item.name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  (item.description || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);



  /* ===========================
          STATISTICS
  =========================== */

  const totalCategories = categories.length;

  const visibleResults = filteredCategories.length;

  const totalDescription = categories.filter(
    (item) => item.description && item.description.trim() !== ""
  ).length;



  /* ===========================
        DELETE CATEGORY
  =========================== */

const handleDelete = (id) => {

  setCategoryId(id);

  setModalType("single");

  setIsModalOpen(true);

};

const confirmDelete = async () => {

  if (!categoryId) return;

  try {

    setDeleteLoading(true);

    const res = await apiCat.delete(`/delete/${categoryId}`, {
      adminId,
     
    });

    toast.success(
      res.data.message ||
      "Category deleted successfully."
    );

     getCategories();

    setCategoryId(null);

    setModalType("");

    setIsModalOpen(false);

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Unable to delete category."
    );

  } finally {

    setDeleteLoading(false);

  }

};



  /* ===========================
        DELETE ALL
  =========================== */


const handleDeleteAll = () => {

  setModalType("all");

  setIsModalOpen(true);

};

const confirmDeleteAll = async () => {

  try {

    setDeleteLoading(true);

    const res = await apiCat.post("/delete-all", {
      adminId,
    });

    toast.success(
      res.data.message || "All categories deleted."
    );

   await getCategories();

setCategoryId(null);

setModalType("");

setIsModalOpen(false);

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Unable to delete categories."
    );

  } finally {

    setDeleteLoading(false);

  }

};

const closeModal = () => {

  if (deleteLoading) return;

  setCategoryId(null);

  setModalType("");

  setIsModalOpen(false);

};
  return (
  <>
<ConfirmationModal
  isOpen={isModalOpen && modalType === "single"}
  onClose={closeModal}
  onConfirm={confirmDelete}
  title="Delete Category"
  message="Are you sure you want to delete this category? This action cannot be undone."
  loading={deleteLoading}
/>


<ConfirmationModal
  isOpen={isModalOpen && modalType === "all"}
  onClose={closeModal}
  onConfirm={confirmDeleteAll}
  title="Delete All Categories"
  message="Are you sure you want to delete all categories? This action cannot be undone."
  loading={deleteLoading}
/>

    <section className="template-list-page page-wrapper">

      <div className="container-custom">

        <div className="theme-card theme-shadow template-list-card">

          {/* ================= HEADER ================= */}

          <div className="list-header">

            <div className="header-content">

              <span className="header-badge">
                DOCUMENT HUB
              </span>

              <div>

                <h2>Categories</h2>

                <p>
                  Manage and organize your document categories.
                </p>

              </div>

            </div>

            <div className="header-actions">

              {categories.length > 0 && (

               <button
  type="button"
  className="secondary-btn"
  onClick={handleDeleteAll}
>
  <FiTrash2 />
  Delete All
</button>

              )}

              <Link
                to="/category"
                className="create-btn"
              >
                <FiPlus />

                Add Category

              </Link>

            </div>

          </div>

          {/* ================= STATS ================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <span className="stat-label">
                Total Categories
              </span>

              <strong>
                {totalCategories}
              </strong>

            </div>

            <div className="stat-card">

              <span className="stat-label">
                With Description
              </span>

              <strong>
                {totalDescription}
              </strong>

            </div>

            <div className="stat-card">

              <span className="stat-label">
                Visible Results
              </span>

              <strong>
                {visibleResults}
              </strong>

            </div>

          </div>

                    {/* ================= SEARCH ================= */}

          <div className="toolbar-row">

            <div className="search-wrapper">

              <FiSearch />

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <div className="results-pill">

              {visibleResults} Result
              {visibleResults === 1 ? "" : "s"}

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="table-responsive">

            <table className="template-table">

              <thead>

                <tr>

                  <th>#</th>

                  <th>Category</th>

                  <th>Description</th>

                  <th>Created</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-row"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((item, index) => (

                    <tr key={item._id}>

                      <td>{index + 1}</td>

                      <td>

                        <div className="template-name">

                          <div className="template-icon-wrap">

                            <FiFolder />

                          </div>

                          <div>

                            <div className="template-title">

                              {item.name}

                            </div>

                            <div className="template-subtitle">

                              Category

                            </div>

                          </div>

                        </div>

                      </td>

                      <td>

                        {item.description || "-"}

                      </td>

                      <td>

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}

                      </td>

                      <td>

                        <div className="action-buttons">

                          <Link
                            to={`/category/update/${item._id}`}
                            className="edit-btn"
                          >

                            <FiEdit2 />

                          </Link>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(item._id)
                            }
                          >

                            <FiTrash2 />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-row"
                    >

                      <div className="empty-state">

                        <FiFolder />

                        <div>

                          <h4>
                            No Categories Found
                          </h4>

                          <p>
                            Create your first category to
                            get started.
                          </p>

                          <Link
                            to="/category"
                            className="create-btn inline-btn"
                          >

                            <FiPlus />

                            Create Category

                          </Link>

                        </div>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </section>

  </>

);

}

export default ViewCategory;
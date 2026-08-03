import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
} from "react-icons/fi";
import { toast } from "react-toastify";

import "./TemplateList.css";
import apiTemp from "../../services/templateService";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const TemplateList = () => {
  const adminId = localStorage.getItem("adminId");

  const [search, setSearch] = useState("");
  const [templateData, setTemplateData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "single" | "all"
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ================= FETCH =================
  const getTemplatesData = async () => {
    try {
      const res = await apiTemp.post("/get-all", { adminId });

      if (res.status === 200) {
        setTemplateData(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTemplatesData();
  }, [adminId]);

  // ================= FORMAT =================
  const templates = templateData.map((item) => ({
    id: item._id,
    title: item.title,
    Category: item.categoryId?.name || "N/A",
    documents: item.required_documents?.length || 0,
    createdAt: new Date(item.createdAt).toLocaleDateString(),
  }));

  // ================= SEARCH =================
  const filtered = templates.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // ================= DELETE SINGLE =================
  const handelDelete = (id) => {
    setDeleteId(id);
    setModalType("single");
    setIsModalOpen(true);
  };

  // ================= DELETE ALL =================
  const handelDeleteAll = () => {
    setModalType("all");
    setIsModalOpen(true);
  };

  // ================= CLOSE =================
  const closeModal = () => {
    if (deleteLoading) return;
    setIsModalOpen(false);
    setDeleteId(null);
    setModalType("");
  };

  // ================= CONFIRM =================
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      let response;

      if (modalType === "single") {
        response = await apiTemp.post("/delete", {
          templateId: deleteId,
          adminId,
        });
      } else if (modalType === "all") {
        response = await apiTemp.post("/delete-all", {
          adminId,
        });
      }

      toast.success(response.data?.message || "Deleted successfully");

      getTemplatesData();
      closeModal();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title={
          modalType === "all"
            ? "Delete All Templates"
            : "Delete Template"
        }
        message={
          modalType === "all"
            ? "Are you sure you want to delete ALL templates? This action cannot be undone."
            : "Are you sure you want to delete this template?"
        }
        loading={deleteLoading}
      />

      <section className="template-list-page page-wrapper">
        <div className="container-custom">
          <div className="theme-card theme-shadow template-list-card">
            
            {/* HEADER */}
            <div className="list-header">
              <div className="header-content">
                <span className="header-badge">Document Hub</span>
                <div>
                  <h2>Templates</h2>
                  <p>Manage and organize your legal document templates.</p>
                </div>
              </div>

              <div className="header-actions">
                {templates.length > 0 && (
                  <button
                    className="secondary-btn"
                    onClick={handelDeleteAll}
                  >
                    <FiTrash2 /> Delete All
                  </button>
                )}

                <Link to="/template/create" className="create-btn">
                  <FiPlus /> Create Template
                </Link>
              </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Templates</span>
                <strong>{templates.length}</strong>
              </div>
              <div className="stat-card">
                <span>Required Docs</span>
                <strong>
                  {templates.reduce(
                    (t, i) => t + i.documents,
                    0
                  )}
                </strong>
              </div>
              <div className="stat-card">
                <span>Visible</span>
                <strong>{filtered.length}</strong>
              </div>
            </div>

            {/* SEARCH */}
            <div className="toolbar-row">
              <div className="search-wrapper">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="template-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Template</th>
                    <th>Category</th>
                    <th>Docs</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length ? (
                    filtered.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="template-name">
                            <FiFileText />
                            {item.title}
                          </div>
                        </td>

                        <td>{item.Category}</td>

                        <td>{item.documents}</td>

                        <td>{item.createdAt}</td>

                        <td>
                          <div className="action-buttons">
                            <Link to={`/template/view/${item.id}`}>
                              <FiEye />
                            </Link>

                            <Link to={`/template/update/${item.id}`}>
                              <FiEdit2 />
                            </Link>

                            <button
                              onClick={() =>
                                handelDelete(item.id)
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
                      <td colSpan="6">
                        No templates found
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
};

export default TemplateList;
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

import "./ClientTemplateList.css";

import apiTemp from "../../services/templateService";

const ClientTemplateList = () => {
  const adminId = localStorage.getItem("adminId");

  const [search, setSearch] = useState("");
  const [templateData, setTemplateData] = useState([]);


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




  return (
    <>

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
                            <Link to={`/client/view/${item.id}`}>
                              <FiEye />
                            </Link>
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

export default ClientTemplateList;
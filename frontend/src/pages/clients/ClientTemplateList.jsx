import { useEffect, useState } from "react";
import { FiSearch, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

import apiTemp from "../../services/templateService";
import apiFirm from "../../services/firmService";

import "./ClientTemplateList.css";

const ClientTemplateList = () => {
  const adminId = "6a7093c6ea3b564981673187";

  const [templates, setTemplates] = useState([]);
  const [firm, setFirm] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    apiFirm.post("/get", { adminId }).then((res) => {
      setFirm(res.data.data);
      console.log("firm dfhsdfgsa",res.data.data);
    });

    apiTemp.post("/get-all", { adminId }).then((res) => {
      setTemplates(res.data.data);
    });
  }, []);

  const categories = ["All", ...new Set(templates.map(t => t.categoryId?.name))];

  const filtered = templates.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || item.categoryId?.name === category)
    );
  });

  const openMap = () => {
    window.open(`https://www.google.com/maps/place/Yogi+Xerox/data=!4m7!3m6!1s0x3be04fdfbe6b6225:0xf696382e3ea559b3!8m2!3d21.2308085!4d72.818945!16s%2Fg%2F11fp42wvzf!19sChIJJWJrvt9P4DsRs1mlPi44lvY?authuser=0&hl=en&rclk=1`);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${firm.primaryPhone}`);
  };

  const sendEmail = () => {
    window.location.href = `mailto:${firm.email}`;
  };

  return (
    <div className="client-container">

      {/* HEADER */}
      <div className="header-card">
        <h2>{firm.company_name}</h2>
        <div className="header-info">
          <span>📞 {firm.primaryPhone}</span>
          <span>📍 {firm.address}</span>
        </div>
      </div>

      {/* WELCOME */}
      <div className="welcome-box">
        <h3>Welcome to {firm.shopName}</h3>
        <p>We provide professional legal documentation services.</p>
      </div>

      {/* FILTERS */}
      <div className="filter-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>
      </div>

      {/* TEMPLATE GRID */}
      <div className="grid">
        {filtered.map((item) => (
          <div className="card" key={item._id}>
            <h4>{item.title}</h4>
            <p>{item.description || "Legal document service"}</p>

            <Link to={`/client/view/${item._id}`} className="btn">
              View →
            </Link>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="footer-bar">
        <button onClick={openMap}>
          <FiMapPin /> Address
        </button>

        <button onClick={openWhatsApp}>
          <FiPhone /> WhatsApp
        </button>

        <button onClick={sendEmail}>
          <FiMail /> Email
        </button>
      </div>
    </div>
  );
};

export default ClientTemplateList;
import { NavLink, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiBriefcase,
  FiFileText,
  FiFolder,
  FiFile,
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLock,
  FiLogOut
} from "react-icons/fi";

import "./Sidebar.css";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    {
      title: "Dashboard",
      icon: <FiHome />,
      path: "/dashboard",
    },
    {
      title: "Firm",
      icon: <FiBriefcase />,
      path: "/firm",
    },
    {
      title: "Templates",
      icon: <FiFileText />,
      path: "/templates",
    },

    {
      title: "Categories",
      icon: <FiGrid />,
      path: "/categories",
    },
    {
      title: "Clients",
      icon: <FiUsers />,
      path: "/client/view",
    },

  ];

  const settings = [
    {
      title: "Profile",
      icon: <FiUser />,
      path: "/profile",
    },
    {
      title: "Change Password",
      icon: <FiLock />,
      path: "/change-password",
    },
    {
      title: "Settings",
      icon: <FiSettings />,
      path: "/settings",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-menu">

        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.title}
          </NavLink>
        ))}

      </div>

      <div className="sidebar-bottom">

        {settings.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.title}
          </NavLink>
        ))}

        <button
          className="sidebar-link logout-link"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <FiLogOut />
          </span>

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
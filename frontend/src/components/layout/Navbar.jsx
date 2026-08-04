import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
} from "react-icons/fi";

import "./Navbar.css";
import apiAuth from "../../services/authService";
import { useState } from "react";
import mainLogo from "../../assets/images/mainLogo.png";

const Navbar = () => {

  const navigate = useNavigate();

 const adminId = localStorage.getItem("adminId");

 const [name, setName] = useState("")

  apiAuth.post("/get",
    {
      adminId
    }).then((res) => {
      if(res.status===200){
        const json = res.data.data;
        setName(json.admin_name);
      }
    })
    
  const admin = {
    name: name,
    profile: ""
  };

  const handleLogout = () => {

    localStorage.clear();
    navigate("/login");

  };

  return (

    <header className="navbar-wrapper">

      <div className="container-custom">

        <div className="navbar-card">

          {/* Left */}

          <Link to="/" className="navbar-logo">

            <img
              src={mainLogo}
              alt="Lexuniq"
              className="navbar-main-logo"
            />

          </Link>

          {/* Right */}

          <div className="navbar-right">

            <Link
              to="/profile"
              className="profile-box"
            >

              {
                admin.profile ?

                  <img
                    src={admin.profile}
                    alt=""
                    className="profile-image"
                  />

                  :

                  <div className="profile-avatar">

                    <FiUser />

                  </div>

              }

              <div>

                <h5>{admin.name}</h5>

                <span>Administrator</span>

              </div>

            </Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >

              <FiLogOut />

              Logout

            </button>

          </div>

        </div>

      </div>

    </header>

  );

};

export default Navbar;
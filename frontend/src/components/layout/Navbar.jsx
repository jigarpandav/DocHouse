import { Link, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiShield
} from "react-icons/fi";

import "./Navbar.css";

const Navbar = () => {

  const navigate = useNavigate();

  const admin = {
    name: "Jigar Pandav",
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

            <div className="logo-icon">
              <FiShield />
            </div>

            <div>

              <h3>Lexuniq</h3>

              <span>Legal Document Platform</span>

            </div>

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
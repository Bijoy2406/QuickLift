import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/header.css";
import Help from "../pages/Help"
const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Access response.data directly since that's how the backend sends it
        setUserRole(response.data.role);
        localStorage.setItem("userRole", response.data.role);
      }
    };
    
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUserRole("");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => navigate("/homepage")}>QuickLift</h1>
        
        <nav className="main-nav">
          <ul className="nav-left">
            <li><Link to="/homepage">Home</Link></li>
            <li><Link to="/Help">Help</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          
            {userRole === 'rider' && (
              <li><Link to="/accept-ride">Accept Ride</Link></li>
            )}
          </ul>

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                <span className="welcome-text">Welcome, {user?.name}</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-button">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

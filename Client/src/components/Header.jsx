import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css"; 

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="app-name" onClick={() => navigate("/homepage")}>QuickLift</h1>
      <nav>
        <ul>
          <li><Link to="/homepage">Home</Link></li>
          <li><Link to="/rides">Rides</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;

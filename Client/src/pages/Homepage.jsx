import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "../styles/homepage.css";

const Homepage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h2>Get a ride in minutes</h2>
          <p>Choose your ride, set your location, and get picked up by a nearby driver.</p>
          <button className="cta-button" onClick={() => navigate("/ridepage")}>
            Request a Ride
          </button>
        </div>
      </section>



      <footer className="footer">
        <p>&copy; 2023 QuickLift. All rights reserved.</p>
        <ul>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default Homepage;

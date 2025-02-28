import React from "react";
import "../styles/homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h2>Get a ride in minutes</h2>
          <p>Choose your ride, set your location, and get picked up by a nearby driver.</p>
          <button className="cta-button">Request a Ride</button>
        </div>
      </section>

      <section className="ride-options">
        <h3>Choose Your Ride</h3>
        <div className="options-grid">
          <div className="option">
            <img src="../../src/assets/economy.png" alt="Economy" />
            <h4>Economy</h4>
            <p>Affordable, everyday rides</p>
          </div>
          <div className="option">
            <img src="../../src/assets/premium.png" alt="Premium" />
            <h4>Premium</h4>
            <p>Luxury rides with top-rated drivers</p>
          </div>
          <div className="option">
            <img src="../../src/assets/shared.png" alt="Shared" />
            <h4>Shared</h4>
            <p>Share your ride and save</p>
          </div>
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

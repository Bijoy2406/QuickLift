import React from 'react';


const Homepage = () => {
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
        <h1>RideShare</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#rides">Rides</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#help">Help</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Get a ride in minutes</h2>
          <p>Choose your ride, set your location, and get picked up by a nearby driver.</p>
          <button className="cta-button">Request a Ride</button>
        </div>
      </section>

      {/* Ride Options Section */}
      <section className="ride-options">
        <h3>Choose Your Ride</h3>
        <div className="options-grid">
          <div className="option">
            <img src="economy-icon.png" alt="Economy" />
            <h4>Economy</h4>
            <p>Affordable, everyday rides</p>
          </div>
          <div className="option">
            <img src="premium-icon.png" alt="Premium" />
            <h4>Premium</h4>
            <p>Luxury rides with top-rated drivers</p>
          </div>
          <div className="option">
            <img src="shared-icon.png" alt="Shared" />
            <h4>Shared</h4>
            <p>Share your ride and save</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2023 RideShare. All rights reserved.</p>
        <ul>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default Homepage;


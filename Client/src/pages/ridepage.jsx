import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ridepage.css"; // Ensure you have styles

const RidePage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState("");

  const handleBooking = () => {
    if (!pickup || !destination || !selectedRide) {
      alert("⚠️ Please fill in all fields before booking.");
      return;
    }
    
    alert(`✅ Ride Booked!\n🚗 Ride Type: ${selectedRide}\n📍 Pickup: ${pickup}\n📍 Destination: ${destination}`);
    
    // Simulate navigation to a "Booking Confirmation" page
    navigate("/confirm");
  };

  return (
    <div className="ride-page">
      <h2>Book a Ride</h2>

      <div className="form-group">
        <label>Pickup Location:</label>
        <input 
          type="text" 
          placeholder="Enter pickup location" 
          value={pickup} 
          onChange={(e) => setPickup(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Destination:</label>
        <input 
          type="text" 
          placeholder="Enter destination" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <h3>Select Your Ride</h3>
      <div className="ride-options">
        <div 
          className={`option ${selectedRide === "Economy" ? "selected" : ""}`} 
          onClick={() => setSelectedRide("Economy")}
        >
          <img src="../../src/assets/economy.png" alt="Economy" />
          <h4>Economy</h4>
          <p>Affordable, everyday rides</p>
        </div>

        <div 
          className={`option ${selectedRide === "Premium" ? "selected" : ""}`} 
          onClick={() => setSelectedRide("Premium")}
        >
          <img src="../../src/assets/premium.png" alt="Premium" />
          <h4>Premium</h4>
          <p>Luxury rides with top-rated drivers</p>
        </div>

        <div 
          className={`option ${selectedRide === "Shared" ? "selected" : ""}`} 
          onClick={() => setSelectedRide("Shared")}
        >
          <img src="../../src/assets/shared.png" alt="Shared" />
          <h4>Shared</h4>
          <p>Share your ride and save</p>
        </div>
      </div>

      <button className="book-btn" onClick={handleBooking}>
        Book Ride
      </button>
    </div>
  );
};

export default RidePage;

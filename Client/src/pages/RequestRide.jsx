import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';
import "../styles/requestRide.css";
import PaymentOptions from './PaymentOptions';

const RequestRide = () => {
  const location = useLocation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [activeRide, setActiveRide] = useState(null);
  const isFormValid = pickup.trim() !== '' && dropoff.trim() !== '';
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Fetch active ride when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const fetchActiveRide = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/rides/active/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.activeRide) {
          setActiveRide(data.activeRide);
        }
      } catch (error) {
        console.error('Error fetching active ride:', error);
      }
    };

    fetchActiveRide();

    const interval = setInterval(fetchActiveRide, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Handle ride request
  const handleRequestRide = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const fare = location.state?.fare || 0;
    
    try {
      const response = await fetch('http://localhost:8000/api/rides/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          pickup_location: pickup,
          dropoff_location: dropoff,
          pickup_coords: "0,0",
          fare: fare,
          payment_method: paymentMethod
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveRide({ status: 'Pending', pickup, dropoff, fare });
        localStorage.setItem('activeRide', JSON.stringify({ status: 'Pending', pickup, dropoff, fare }));
        setPickup('');
        setDropoff('');
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
    }
  };

  return (
    <div className="request-ride-container">
      {!activeRide ? (
        <div className="booking-form">
          <h2>Request a Ride</h2>
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
          <PaymentOptions 
            fare={location.state?.fare || 0}
            onPaymentSelect={(method) => setPaymentMethod(method)}
          />
          <button 
            onClick={handleRequestRide} 
            disabled={!isFormValid || !paymentMethod}
            className={(!isFormValid || !paymentMethod) ? 'button-disabled' : ''}>
            Request Ride
          </button>
        </div>
      ) : (
        <div className="active-ride">
          <h3>Ride Status</h3>
          <p>Status: {activeRide.status}</p>
          <p>From: {activeRide.pickup}</p>
          <p>To: {activeRide.dropoff}</p>
          <p>Fare: ৳{activeRide.fare}</p>
          <p>Payment Method: {activeRide.payment_method}</p>
        </div>
      )}
    </div>
  );
};

export default RequestRide;

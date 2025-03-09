import React, { useState, useEffect } from 'react';
import "../styles/acceptRide.css";

const AcceptRide = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [hasActiveRide, setHasActiveRide] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
        const token = localStorage.getItem('token');
        const riderId = localStorage.getItem('userId');

        try {
            // Fetch pending rides
            const pendingResponse = await fetch('http://localhost:8000/api/rides/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pendingData = await pendingResponse.json();
            setRideRequests(pendingData.rides || []);

            // Fetch accepted rides
            const acceptedResponse = await fetch(`http://localhost:8000/api/rides/accepted/${riderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const acceptedData = await acceptedResponse.json();
            if (acceptedData.rides && acceptedData.rides.length > 0) {
                setAcceptedRides(acceptedData.rides);
                setHasActiveRide(true);
                // Store accepted rides in localStorage
                localStorage.setItem('acceptedRides', JSON.stringify(acceptedData.rides));
            } else {
                setAcceptedRides([]);
                setHasActiveRide(false);
                localStorage.removeItem('acceptedRides');
            }
        } catch (error) {
            console.error('Error fetching rides:', error);
        }
    };

    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAcceptRide = async (requestId) => {
    if (hasActiveRide) {
        alert('Please complete your current ride before accepting a new one');
        return;
    }

    const token = localStorage.getItem('token');
    const riderId = localStorage.getItem('userId');
    
    console.log('Token:', token);
    console.log('RiderId:', riderId);

    try {
        const response = await fetch(`http://localhost:8000/api/rides/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: 'Accepted',
                riderId: parseInt(riderId)
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            return;
        }

        const acceptedRide = rideRequests.find(req => req.id === requestId);
        setRideRequests(prev => prev.filter(req => req.id !== requestId));
        setAcceptedRides([{ ...acceptedRide, status: 'Accepted' }]);
        setHasActiveRide(true);
    } catch (error) {
        console.error('Error accepting ride:', error);
    }
  };

  const handleCompleteRide = async (requestId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/rides/${requestId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setAcceptedRides([]);
        setHasActiveRide(false);
        // Clear from localStorage
        localStorage.removeItem('acceptedRides');
        
        // API call to notify the system that the ride is complete (replace with your actual API endpoint if necessary)
        await fetch(`http://localhost:8000/api/rides/${requestId}/notify-completion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  return (
    <div className="rider-dashboard">
      <h2>Available Ride Requests</h2>
      <div className="ride-requests">
        {rideRequests.map((request) => (
          <div key={request.id} className="ride-request-card">
            <p>From: {request.pickup_location}</p>
            <p>To: {request.dropoff_location}</p>
            <p>Fare: ৳{request.fare}</p>
            <button 
              onClick={() => handleAcceptRide(request.id)}
              disabled={hasActiveRide}
              className={hasActiveRide ? 'button-disabled' : ''}
            >
              Accept Ride
            </button>
          </div>
        ))}
      </div>

      <h2>Accepted Rides</h2>
      <div className="accepted-rides">
        {acceptedRides.map((ride) => (
          <div key={ride.id} className="ride-request-card">
            <p>From: {ride.pickup_location}</p>
            <p>To: {ride.dropoff_location}</p>
            <p>Status: {ride.status}</p>
            <p>Fare: ৳{ride.fare}</p>
            <button onClick={() => handleCompleteRide(ride.id)}>
              Complete Ride
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptRide;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from 'axios';
import "../styles/homepage.css";

const Homepage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRideOption, setSelectedRideOption] = useState(null);

  const calculateFare = (rideType) => {
    switch(rideType) {
      case 'economy':
        return Math.floor(Math.random() * (400 - 100 + 1)) + 100;
      case 'premium':
        return Math.floor(Math.random() * (700 - 300 + 1)) + 300;
      case 'shared':
        return Math.floor(Math.random() * (500 - 200 + 1)) + 200;
      default:
        return 0;
    }
  };
  
  const handleOptionSelect = (option) => {
    const fare = calculateFare(option);
    setSelectedRideOption(option);
    navigate('/request-ride', { state: { rideOption: option, fare: fare } });
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 23.8103,
    lng: 90.4125,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUserRole(data.role);
        localStorage.setItem('userRole', data.role);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);

          if (userRole === 'rider') {
            // API call to update location on the server
            axios.post('http://localhost:8000/api/update-location', {
              riderId: user?.id,
              location: location
            })
            .then(response => {
              console.log("Location updated successfully");
            })
            .catch(error => {
              console.error("Error updating location:", error);
            });
          }
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }

    // Polling every 5 seconds to get the updated location of the rider from the server
    const locationInterval = setInterval(() => {
      if (userRole === 'rider') {
        axios.get(`http://localhost:8000/api/rider-location/${user?.id}`)
          .then(response => {
            setCurrentLocation(response.data.location);
          })
          .catch(error => {
            console.error("Error fetching rider location:", error);
          });
      }
    }, 5000);

    return () => {
      clearInterval(locationInterval);
    };
  }, [user, userRole]);

  const toggleTracker = () => {
    setShowTracker(!showTracker);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Get a ride in minutes</h2>
          <p>Choose your ride, set your location, and get picked up by a nearby driver.</p>
          <h2>Select your desired ride</h2>
        </div>
      </section>

      {/* Tracker Section */}
      {showTracker && (
        <div className="tracker-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation || center}
            zoom={14}
          >
            {currentLocation && (
              <Marker
                position={currentLocation}
                title={userRole === 'rider' ? 'Your Location' : 'Rider Location'}
              />
            )}
          </GoogleMap>
        </div>
      )}

      {/* Ride Options Section */}
      <section className="ride-options">
        <div className="options-grid">
          <div 
            className={`option ${selectedRideOption === 'economy' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('economy')}
          >
            <img src="../../src/assets/economy.png" alt="Economy" />
            <h4>Economy</h4>
            <p>Affordable, everyday rides</p>
          </div>
          <div 
            className={`option ${selectedRideOption === 'premium' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('premium')}
          >
            <img src="../../src/assets/premium.png" alt="Premium" />
            <h4>Premium</h4>
            <p>Luxury rides with top-rated drivers</p>
          </div>
          <div 
            className={`option ${selectedRideOption === 'shared' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('shared')}
          >
            <img src="../../src/assets/shared.png" alt="Shared" />
            <h4>Shared</h4>
            <p>Share your ride and save</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
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

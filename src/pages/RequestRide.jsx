import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import "../styles/requestRide.css";
import PaymentOptions from './PaymentOptions';

const RequestRide = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [activeRide, setActiveRide] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const fare = location.state?.fare || 0;
    const token = localStorage.getItem('token');

    const isFormValid = pickup.trim() !== '' && dropoff.trim() !== '' && paymentMethod !== '';

    useEffect(() => {
        console.log("User:", user);
        console.log("Token:", token);
    }, [user, token]);

    useEffect(() => {
        const fetchActiveRide = async () => {
            if (!user || !token) {
                console.warn('User not logged in');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/api/rides/active/${user.user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (response.data.activeRide) {
                    setActiveRide(response.data.activeRide);
                }
            } catch (error) {
                console.error('Error fetching active ride:', error);
            }
        };

        fetchActiveRide();

        const interval = setInterval(fetchActiveRide, 5000);
        return () => clearInterval(interval);
    }, [user, token]);

    const handleRequestRide = async () => {
        if (!user || !token) {
            console.warn('User not logged in');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/rides/request', {
                user_id: user.user_id,
                pickup_location: pickup,
                dropoff_location: dropoff,
                fare: fare,
                payment_method: paymentMethod
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setActiveRide({
                    status: 'Pending',
                    pickup,
                    dropoff,
                    fare,
                    payment_method: paymentMethod
                });
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
                        fare={fare}
                        onPaymentSelect={(method) => setPaymentMethod(method)}
                    />
                    <button 
                        onClick={handleRequestRide} 
                        disabled={!isFormValid}
                        className={(!isFormValid) ? 'button-disabled' : ''}>
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
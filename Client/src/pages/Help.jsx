import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Help = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error("❌ Failed to fetch profile:", error);
            alert("Please log in first!");
            navigate("/login");
        });
    }, [navigate]);

    return (
        <div className="help-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Help & Support</h2>
            {user ? (
                user.role === "rider" ? (
                    <div>
                        <h3>Rider Help Section</h3>
                        <p>🔹 How to accept a ride request</p>
                        <p>🔹 How to manage your ride history</p>
                        <p>🔹 Safety tips for drivers</p>
                        <p>🔹 Payment and earnings guide</p>
                    </div>
                ) : (
                    <div>
                        <h3>User Help Section</h3>
                        <p>🔹 How to book a ride</p>
                        <p>🔹 Understanding fare estimates</p>
                        <p>🔹 Cancelling a ride</p>
                        <p>🔹 Reporting an issue</p>
                    </div>
                )
            ) : (
                <p>Loading help content...</p>
            )}
        </div>
    );
};

export default Help;

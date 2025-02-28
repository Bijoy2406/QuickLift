import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        password: '',
        role: '',
        car_number: '',
        car_details: ''
    });

    const [originalProfile, setOriginalProfile] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setProfile(response.data);
            setOriginalProfile(response.data);
        })
        .catch(error => {
            console.error("❌ Failed to fetch profile:", error);
        });
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("🚀 Sending update request:", profile);

        axios.put("http://localhost:8000/api/profile", profile, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            console.log("✅ Profile updated successfully:", response.data);
            alert(response.data.message);
        })
        .catch(error => {
            console.error("❌ Failed to update profile:", error.response?.data || error.message);
            alert("Failed to update profile: " + (error.response?.data?.error || "Unknown error"));
        });
    };

    return (
        <div className="edit-profile-container" style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} required />

                <label>New Password (leave blank to keep current):</label>
                <input type="password" name="password" value={profile.password} onChange={handleChange} placeholder="********" />

                <label>Role:</label>
                <input type="text" name="role" value={profile.role} disabled />

                {profile.role === "rider" && (
                    <>
                        <label>Car Number:</label>
                        <input type="text" name="car_number" value={profile.car_number || ''} onChange={handleChange} />

                        <label>Car Details:</label>
                        <input type="text" name="car_details" value={profile.car_details || ''} onChange={handleChange} />
                    </>
                )}

                <button type="submit" disabled={JSON.stringify(profile) === JSON.stringify(originalProfile)} style={{ marginTop: "10px", padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfile;

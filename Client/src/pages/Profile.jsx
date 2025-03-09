import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            setUpdatedUser(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/profile/update', updatedUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            alert('Profile updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating profile');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>Profile</h2>
            {user ? (
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={updatedUser.name || ''} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={updatedUser.email || ''} onChange={handleChange} required disabled />
                    </div>
                    {user.role === 'rider' && (
                        <div>
                            <label>Vehicle Type:</label>
                            <input type="text" name="vehicle_type" value={updatedUser.vehicle_type || ''} onChange={handleChange} />
                        </div>
                    )}
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <p>No profile data found.</p>
            )}
        </div>
    );
};

export default Profile;

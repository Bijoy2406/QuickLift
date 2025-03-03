import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../styles/profile.css";

const updateProfile = async (updatedData, token) => {
  try {
    const response = await axios.put("http://localhost:8000/api/profile", updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Profile update failed:", error.response?.data);
    throw error.response?.data || "Error updating profile";
  }
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setUpdatedUser(response.data); // Set initial values for editing
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await updateProfile(updatedUser, token);
      setUser(updatedUser); // Update UI with new data
      setIsEditing(false);
    } catch (err) {
      setError(err.error || "Failed to update profile");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {user ? (
        <div className="profile-details">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}

          {isEditing ? (
            <>
              <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
              <input type="text" name="preferred_location" value={updatedUser.preferred_location || ""} onChange={handleChange} />
              {user.role === 'rider' && (
                <>
                  <input type="text" name="car_number" value={updatedUser.car_number || ""} onChange={handleChange} />
                  <input type="text" name="car_details" value={updatedUser.car_details || ""} onChange={handleChange} />
                </>
              )}
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Address:</strong> {user.preferred_location || "N/A"}</p>
              {user.role === 'rider' && (
                <>
                  <p><strong>Car Number:</strong> {user.car_number}</p>
                  <p><strong>Car Details:</strong> {user.car_details}</p>
                </>
              )}
              <button onClick={handleEdit} className="edit-button">Edit</button>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;

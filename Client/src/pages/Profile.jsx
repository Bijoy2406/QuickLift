import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
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

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {user ? (
        <div className="profile-details">
          <img src={user.avatar || "/default-avatar.png"} alt="Profile" className="profile-avatar" />
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;

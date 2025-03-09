import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    try {
        const response = await axios.get("http://localhost:8000/api/profile", {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        setUser(response.data);
    } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
    }
};


useEffect(() => {
  console.log("User:", user);
}, [user]);
  useEffect(() => {
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
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/profile",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
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
              <div className="edit-field">
                <h3>Name</h3>
                <input
                  type="text"
                  name="name"
                  value={updatedUser.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="edit-field">
                <h3>Email</h3>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email || ""}
                  onChange={handleChange}
                />
              </div>

              {user.role === 'rider' && (
                <>
                  <div className="edit-field">
                    <h3>Car Number</h3>
                    <input
                      type="text"
                      name="car_number"
                      value={updatedUser.car_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="edit-field">
                    <h3>Car Details</h3>
                    <input
                      type="text"
                      name="car_details"
                      value={updatedUser.car_details || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setIsEditing(false)} disabled={isLoading}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="field">
                <h3>Name:</h3>
                <p>{user.name}</p>
              </div>

              <div className="field">
                <h3>Email:</h3>
                <p>{user.email}</p>
              </div>

              <div className="field">
                <h3>Role:</h3>
                <p>{user.role}</p>
              </div>

              {user.role === 'rider' && (
                <>
                  <div className="field">
                    <h3>Car Number:</h3>
                    <p>{user.car_number}</p>
                  </div>

                  <div className="field">
                    <h3>Car Details:</h3>
                    <p>{user.car_details}</p>
                  </div>
                </>
              )}

              <button onClick={handleEdit}>Edit Profile</button>
            </>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;

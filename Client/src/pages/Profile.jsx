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
  const [isLoading, setIsLoading] = useState(false); // Loading state for editing
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

        console.log("Fetched user data:", response.data); // Debugging: Log fetched data

        // Ensure the response data is in the correct format
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setUpdatedUser(response.data.user); // Set initial values for editing
        } else {
          setError("Invalid profile data format");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
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
    setIsLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token");
      const updatedProfile = await updateProfile(updatedUser, token);

      // Update UI with new data
      setUser(updatedProfile.user); // Ensure this matches the backend response structure
      setIsEditing(false);
    } catch (err) {
      setError(err.error || "Failed to update profile");
    } finally {
      setIsLoading(false); // Stop loading
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
              {/* Editable Name Section */}
              <div className="edit-field">
                <h3>Name</h3>
                <input type="text" name="name" value={updatedUser.name || ""} onChange={handleChange} />
              </div>

              {/* Editable Email Section */}
              <div className="edit-field">
                <h3>Email</h3>
                <input type="email" name="email" value={updatedUser.email || ""} onChange={handleChange} />
              </div>

              {/* Editable Password Section */}
              <div className="edit-field">
                <h3>Password</h3>
                <input type="password" name="password" value={updatedUser.password || ""} onChange={handleChange} />
                <small>Leave blank to keep current password</small>
              </div>

              {/* Role-specific Fields */}
              {user.role === 'rider' && (
                <>
                  <div className="edit-field">
                    <h3>Car Number</h3>
                    <input type="text" name="car_number" value={updatedUser.car_number || ""} onChange={handleChange} />
                  </div>

                  <div className="edit-field">
                    <h3>Car Details</h3>
                    <input type="text" name="car_details" value={updatedUser.car_details || ""} onChange={handleChange} />
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
              {/* Display User Information */}
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

              {/* Display Rider-specific Fields */}
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
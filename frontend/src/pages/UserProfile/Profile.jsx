import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import { useToast } from "../../features/toast/contexts/ToastContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user, fetchUser } = useAuth();
  const { showToast } = useToast();

  // State Declarations
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Effect: Sync local state with auth context user
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
      setLoading(false);
    } else if (isLoggedIn) {
        // Logged in but no user data yet
        fetchUser();
    }
  }, [user, isLoggedIn, fetchUser]);

  // Handler: Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Password updated successfully", "success");
        setShowPasswordForm(false);
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        showToast(data.message || "Update failed", "error");
      }
    } catch (error) {
      showToast("Server Error", "error");
    }
  };

  // Handler: Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: userInfo.name }),
      });

      if (res.ok) {
        showToast("Profile updated successfully", "success");
        setIsEditing(false);
        await fetchUser();
      } else {
        showToast("Update failed", "error");
      }
    } catch (error) {
      showToast("Server Error", "error");
    }
  };

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="avatar-placeholder">
            {userInfo.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-profile-label">User Profile</div>
        <div className="user-name">
          <h2>{userInfo.name}</h2>
        </div>
        <div className="user-role-badge">{userInfo.role || "User"}</div>
        <p style={{ marginTop: "1rem", color: "#718096" }}>
          {userInfo.email}
        </p>
        <button
          className="sign-out-button"
          style={{ marginTop: "2rem", width: "100%" }}
          onClick={() => {
            logout();
            navigate("/signin", { replace: true });
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        
        {/* General Information Card */}
        <div className="section-card">
          <div className="section-header">
            <h3>General Information</h3>
            <button
                className="btn-primary" 
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} 
                onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                className="form-input"
                value={userInfo.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                    type='email'
                    className="form-input"
                    value={userInfo.email}
                    disabled
                />
                <small style={{color:'#a0aec0'}}>Email cannot be changed</small>
            </div>

            {isEditing && (
              <button type="submit" className="save-button">
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Security Card */}
        <div className="section-card">
          <div className="section-header">
            <h3>Security</h3>
          </div>
          {!showPasswordForm ? (
            <>
              <p>Want to change your password?</p>
              <button
                className="update-password-button"
                onClick={() => setShowPasswordForm(true)}
              >
                Update Password
              </button>
            </>
          ) : (
            <form onSubmit={handleChangePassword} style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="save-button">
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ oldPassword: "", newPassword: "" });
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #cbd5e0",
                    borderRadius: "6px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

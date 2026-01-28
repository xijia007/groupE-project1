import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import { useToast } from "../../features/toast/contexts/ToastContext";
import "./Profile.css";

function Profile() {
    const { isLoggedIn, logout } = useAuth();
    const { showToast } = useToast();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        role: "",
    })
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserDate = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUserInfo(data.user);
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserDate();
        }
    }, [isLoggedIn]);

    const handleUpdateProfile = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: userInfo.name })
            });

            if (res.ok) {
                showToast('Profile updated successfully', 'success');
                setIsEditing(false);
                fetchUserDate();
            } else {
                showToast('Update failed', 'error');
            }
        } catch (error) {
            showToast('Server Error', 'error');
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="user-name">
                    <h2>{userInfo.name}</h2>
                </div>
                <div className="user-role-badge">
                    {userInfo.role || "User"}
                </div>
                <p style={{marginTop: '1rem', color: '#718096'}}>
                    {userInfo.email}
                </p>
                <button 
                    className="sign-out-button" 
                    style={{marginTop: '2rem', width: '100%'}} 
                    onClick={logout}
                >
                    Sign Out
                </button>
            </div>

            <div className="profile-content">
                <div className="section-card">
                    <div className="section-header">
                        <h3>General Information</h3>
                        <button
                            onClick={()=> setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Full Name</label>
                                <input 
                                    type='text'
                                    className="form-input"
                                    value={userInfo.name}
                                    disabled={!isEditing}
                                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
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
                            <button type='submit' className="save-button">
                                Save Changes
                            </button>
                        )}
                    </form>
                </div>
                <div className="section-card">
                    <div className="section-header">
                        <h3>Security</h3>
                    </div>
                    <p>Want to change your password?</p>
                    <button className="update-password-button">Update Password</button>
                </div>
            </div>

        </div>
    )
}

export default Profile;
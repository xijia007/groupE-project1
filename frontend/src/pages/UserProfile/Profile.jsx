import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import { useToast } from "../../features/toast/contexts/ToastContext";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const { isLoggedIn, logout, user, fetchUser } = useAuth(); // 获取 fetchUser 和 user
    const { showToast } = useToast();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        role: "",
    })
    
    // 当全局 user 变化时，更新本地表单 state
    useEffect(() => {
        if (user) {
            setUserInfo({
                name: user.name || "",
                email: user.email || "",
                role: user.role || ""
            });
            setLoading(false);
        }
    }, [user]);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(!user); // 如果没有 user，则 loading

    // 修改密码相关状态
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Password updated successfully', 'success');
                setShowPasswordForm(false);
                setPasswordData({ oldPassword: "", newPassword: "" });
            } else {
                showToast(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            showToast('Server Error', 'error');
        }
    };

    // 删除 fetchUserDate，完全依赖 AuthContext
    
    useEffect(() => {
        // 如果已登录但没有用户数据（例如刚刷新页面），尝试 fetch
        if (isLoggedIn && !user) {
            fetchUser();
        }
    }, [isLoggedIn, user, fetchUser]);

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
                // 刷新全局状态，这将触发上面的 useEffect 更新本地 userInfo
                await fetchUser(); 
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
                <div className="user-profile-label">User profile</div>
                <div className="user-name">
                    <h2>Name: {userInfo.name}</h2>
                </div>
                <div className="user-role-badge">
                    Role: {userInfo.role || "User"}
                </div>
                <p style={{marginTop: '1rem', color: '#718096'}}>
                    Email: {userInfo.email}
                </p>
                <button 
                    className="sign-out-button" 
                    style={{marginTop: '2rem', width: '100%'}} 
                    onClick={() => {
                        logout();
                        navigate("/signin");
                    }}
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
                            <label>User Name</label>
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
                    {/* 修改密码表单区域 */}
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
                        <form onSubmit={handleChangePassword} style={{marginTop: '1rem'}}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input 
                                    type="password" 
                                    className="form-input"
                                    required
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    className="form-input"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
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
                                        padding: '0.75rem 1.5rem',
                                        border: '1px solid #cbd5e0',
                                        borderRadius: '6px',
                                        background: 'white',
                                        cursor: 'pointer'
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
    )
}

export default Profile;
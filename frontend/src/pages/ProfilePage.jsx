import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navigationbar";
import { authService, cloudinaryService } from "../services/api";

const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.userName || "");
            setProfilePic(user.profilePic || "");
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const imageUrl = await cloudinaryService.uploadImage(file);
            setProfilePic(imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(error.message || "Failed to upload image. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert("Error: No user found. Please log in again.");
            return;
        }
    
        try {
            console.log("🔄 Starting profile update...");
            console.log("User data:", { userName: name, profilePic });
            
            const data = await authService.updateProfile({ userName: name, profilePic });
            console.log("✅ Profile update response:", data);
            
            if (data.user) {
                updateUser(data.user);
                alert("Profile updated successfully!");
                navigate('/home');
            } else {
                console.error("❌ Profile update failed - no user data returned:", data);
                throw new Error("Failed to update profile - no user data returned");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            alert(`Error updating profile: ${error.message}. Please try again.`);
        }
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.profileCard}>
                    <h2 style={styles.title}>My Profile</h2>
                    
                    <div style={styles.profileSection}>
                        <div style={styles.imageSection}>
                            <label htmlFor="profilePicInput" style={styles.imageContainer}>
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" style={styles.profileImage} />
                                ) : (
                                    <div style={styles.defaultProfilePic}>
                                        {name ? name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}
                                <div style={styles.imageOverlay}>
                                    <span style={styles.changePhotoText}>Change Photo</span>
                                </div>
                            </label>
                            <input 
                                id="profilePicInput" 
                                type="file" 
                                onChange={handleFileChange} 
                                style={{ display: "none" }} 
                                accept="image/*"
                            />
                            {loading && <p style={styles.loadingText}>Uploading...</p>}
                        </div>

                        <div style={styles.infoSection}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    style={styles.input}
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input 
                                    type="email" 
                                    value={user?.email || ""} 
                                    disabled
                                    style={{...styles.input, backgroundColor: '#f5f5f5'}}
                                />
                            </div>
                            <button onClick={handleSave} style={styles.saveButton}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    .imageContainer:hover .imageOverlay {
                        opacity: 1;
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f4f4f4',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto',
    },
    title: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#007bff',
        marginBottom: '32px',
        textAlign: 'left',
    },
    profileSection: {
        display: 'flex',
        gap: '48px',
        alignItems: 'flex-start',
    },
    imageSection: {
        flex: '0 0 auto',
    },
    imageContainer: {
        position: 'relative',
        display: 'block',
        cursor: 'pointer',
        width: '200px',
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    defaultProfilePic: {
        width: '100%',
        height: '100%',
        backgroundColor: '#007bff',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '64px',
        fontWeight: '600',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    changePhotoText: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '500',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: '8px',
        color: '#666',
    },
    infoSection: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: '24px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:focus': {
            borderColor: '#007bff',
            boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.1)',
            outline: 'none',
        }
    },
    saveButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#0056b3',
        }
    },
};

export default ProfilePage;

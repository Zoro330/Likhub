import { useState, useEffect, useContext } from "react";
import NavBar from "../components/Navigationbar";
import CreatePost from "../components/CreatePost";
import { AuthContext } from "../context/AuthContext";
import { inventionsService, authService } from "../services/api";

const InventionPage = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("Popular");
    // eslint-disable-next-line no-unused-vars
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchInventions = async () => {
        try {
            const data = await inventionsService.getInventions();

            if (!Array.isArray(data)) {
                console.error("❌ Invalid data format received:", data);
                setPosts([]);
                return;
            }

            // Fetch latest user data for all unique users in the posts
            const uniqueUserIds = [...new Set(data.map(post => post.userId))].filter(id => id); // Filter out null/undefined
            const userDataMap = new Map();

            // Fetch user data for each unique user
            await Promise.all(uniqueUserIds.map(async (userId) => {
                try {
                    if (!userId) return; // Skip if userId is null/undefined
                    const userData = await authService.getUser(userId);
                    if (userData.user) {
                        userDataMap.set(userId, userData.user);
                    }
                } catch (error) {
                    console.error(`Error fetching user data for ${userId}:`, error);
                }
            }));

            // Map through the posts and update profile pictures using the latest user data
            const mappedPosts = data.map(post => {
                const userData = userDataMap.get(post.userId);
                return {
                    ...post,
                    userProfilePic: userData?.profilePic || post.userProfilePic || "",
                    userName: userData?.userName || post.userName || "Unknown User"
                };
            });

            setPosts(mappedPosts);
        } catch (error) {
            console.error("🔥 Error fetching inventions:", error);
            setPosts([]);
        }
    };

    useEffect(() => {
        fetchInventions();
    }, [user?.profilePic]); // Only depend on the profile picture

    const refreshPosts = () => {
        fetchInventions();
    };

    const handleLike = async (postId) => {
        try {
            if (!user) {
                alert("Please login to like posts");
                return;
            }

            // Check if user has already liked the post
            const post = posts.find(p => p._id === postId);
            if (post?.likes?.includes(user?._id)) {
                alert("You have already liked this post!");
                return;
            }

            const updatedPost = await inventionsService.likeInvention(postId);
            
            // Update the posts state to reflect the new like
            setPosts(posts.map(post => 
                post._id === postId ? updatedPost : post
            ));

        } catch (error) {
            console.error("❌ Like request failed:", error);
            alert("Failed to like post. Please try again.");
        }
    };
    
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            if (!user) {
                alert("You must be logged in to delete posts");
                return;
            }

            await inventionsService.deleteInvention(postId);

            // Remove the deleted post from the state
            setPosts(posts.filter(post => post._id !== postId));
            alert("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert(error.message || "Error deleting post. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <NavBar />
            <div style={styles.content}>
                <div style={styles.tabContainer}>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'Popular' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('Popular')}
                        className={`tab-button ${activeTab === 'Popular' ? 'active' : ''}`}
                    >
                        Popular
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'AllInventions' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('AllInventions')}
                        className={`tab-button ${activeTab === 'AllInventions' ? 'active' : ''}`}
                    >
                        All Inventions
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'MyInventions' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('MyInventions')}
                        className={`tab-button ${activeTab === 'MyInventions' ? 'active' : ''}`}
                    >
                        My Inventions
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'CreatePost' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('CreatePost')}
                        className={`tab-button ${activeTab === 'CreatePost' ? 'active' : ''}`}
                    >
                        Create Post
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'Popular' && (
                        <div className="tab-panel active">
                            <h2 style={styles.tabTitle}>Popular Inventions</h2>
                            <div style={styles.postGrid}>
                                {posts.filter(post => (post.likes?.length || 0) >= 5).map(post => (
                                    <div key={post._id} style={styles.postCard} className="postCard">
                                        <div style={styles.postHeader}>
                                            <div style={styles.userInfo}>
                                                {post.userProfilePic ? (
                                                    <img src={post.userProfilePic} alt={post.userName || "User"} style={styles.userProfilePic} />
                                                ) : (
                                                    <div style={styles.defaultProfilePic}>
                                                        {(post.userName || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div style={styles.postTitleSection}>
                                                    <h3 style={styles.title}>{post.title}</h3>
                                                    <p style={styles.postedBy}>Posted by {post.userName || "Unknown User"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            style={{...styles.image, cursor: 'pointer'}}
                                            onClick={() => handleImageClick(post.image)}
                                        />
                                        <p style={styles.description}>{post.description}</p>
                                        <div style={styles.actionButtons}>
                                            <button 
                                                onClick={() => handleLike(post._id)} 
                                                style={{
                                                    ...styles.likeButton,
                                                    color: post.likes?.includes(user?._id) ? '#007bff' : '#666'
                                                }}
                                                className="like-button"
                                            >
                                                <img 
                                                    src="/images/heart-icon.png" 
                                                    alt="Like" 
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        filter: post.likes?.includes(user?._id) 
                                                            ? 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1234%) hue-rotate(210deg) brightness(97%) contrast(101%)'
                                                            : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                                                    }}
                                                />
                                                <span>{post.likes?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'AllInventions' && (
                        <div className="tab-panel active">
                            <h2 style={styles.tabTitle}>All Inventions</h2>
                            <div style={styles.postGrid}>
                                {posts.map(post => (
                                    <div key={post._id} style={styles.postCard} className="postCard">
                                        <div style={styles.postHeader}>
                                            <div style={styles.userInfo}>
                                                {post.userProfilePic ? (
                                                    <img src={post.userProfilePic} alt={post.userName || "User"} style={styles.userProfilePic} />
                                                ) : (
                                                    <div style={styles.defaultProfilePic}>
                                                        {(post.userName || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div style={styles.postTitleSection}>
                                                    <h3 style={styles.title}>{post.title}</h3>
                                                    <p style={styles.postedBy}>Posted by {post.userName || "Unknown User"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            style={{...styles.image, cursor: 'pointer'}}
                                            onClick={() => handleImageClick(post.image)}
                                        />
                                        <p style={styles.description}>{post.description}</p>
                                        <div style={styles.actionButtons}>
                                            <button 
                                                onClick={() => handleLike(post._id)} 
                                                style={{
                                                    ...styles.likeButton,
                                                    color: post.likes?.includes(user?._id) ? '#007bff' : '#666'
                                                }}
                                                className="like-button"
                                            >
                                                <img 
                                                    src="/images/heart-icon.png" 
                                                    alt="Like" 
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        filter: post.likes?.includes(user?._id) 
                                                            ? 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1234%) hue-rotate(210deg) brightness(97%) contrast(101%)'
                                                            : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                                                    }}
                                                />
                                                <span>{post.likes?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'MyInventions' && user && (
                        <div className="tab-panel active">
                            <h2 style={styles.tabTitle}>My Inventions</h2>
                            <div style={styles.postGrid}>
                                {posts.filter(post => post.userId === user._id).map(post => (
                                    <div key={post._id} style={styles.postCard} className="postCard">
                                        <div style={styles.postHeader}>
                                            <div style={styles.userInfo}>
                                                {post.userProfilePic ? (
                                                    <img src={post.userProfilePic} alt={post.userName || "User"} style={styles.userProfilePic} />
                                                ) : (
                                                    <div style={styles.defaultProfilePic}>
                                                        {(post.userName || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div style={styles.postTitleSection}>
                                                    <h3 style={styles.title}>{post.title}</h3>
                                                    <p style={styles.postedBy}>Posted by {post.userName || "Unknown User"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            style={{...styles.image, cursor: 'pointer'}}
                                            onClick={() => handleImageClick(post.image)}
                                        />
                                        <p style={styles.description}>{post.description}</p>
                                        <div style={styles.actionButtons}>
                                            <button 
                                                onClick={() => handleLike(post._id)} 
                                                style={{
                                                    ...styles.likeButton,
                                                    color: post.likes?.includes(user?._id) ? '#007bff' : '#666'
                                                }}
                                                className="like-button"
                                            >
                                                <img 
                                                    src="/images/heart-icon.png" 
                                                    alt="Like" 
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        filter: post.likes?.includes(user?._id) 
                                                            ? 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1234%) hue-rotate(210deg) brightness(97%) contrast(101%)'
                                                            : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                                                    }}
                                                />
                                                <span>{post.likes?.length || 0}</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                style={styles.deleteButton}
                                                className="delete-button"
                                                title="Delete post"
                                            >
                                                <i className="fas fa-trash" style={styles.deleteIcon}></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'CreatePost' && (
                        <div className="tab-panel active">
                            <h2 style={styles.tabTitle}>Create New Post</h2>
                            <CreatePost 
                                onPostCreated={refreshPosts} 
                                onClose={() => setShowCreatePost(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div 
                    style={styles.modalOverlay} 
                    onClick={closeModal}
                    className="image-modal"
                >
                    <button 
                        style={styles.closeButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeModal();
                        }}
                        className="close-modal-button"
                    >
                        ×
                    </button>
                    <div style={styles.modalContent}>
                        <img 
                            src={selectedImage} 
                            alt="Full size" 
                            style={styles.modalImage}
                            className="modal-image"
                        />
                    </div>
                </div>
            )}

            <style>
                {`
                    .tab-button {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .tab-button::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        width: 0;
                        height: 2px;
                        background: #007bff;
                        transition: all 0.3s ease;
                        transform: translateX(-50%);
                    }
                    
                    .tab-button:hover::after {
                        width: 100%;
                    }
                    
                    .tab-button.active::after {
                        width: 100%;
                    }
                    
                    .tab-panel {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeIn 0.5s ease forwards;
                    }
                    
                    @keyframes fadeIn {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .postCard {
                        animation: slideUp 0.5s ease-out;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .postCard:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }

                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .image-modal {
                        animation: fadeIn 0.3s ease-out;
                    }
                    
                    .modal-image {
                        animation: scaleIn 0.3s ease-out;
                    }
                    
                    @keyframes scaleIn {
                        from {
                            transform: scale(0.9);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    .close-modal-button {
                        transition: all 0.3s ease;
                    }
                    
                    .close-modal-button:hover {
                        transform: scale(1.1);
                    }

                    .like-button {
                        transition: all 0.3s ease;
                    }

                    .like-button:hover {
                        transform: scale(1.1);
                    }

                    .delete-button {
                        transition: all 0.3s ease;
                    }

                    .delete-button:hover {
                        transform: scale(1.1);
                        color: #dc3545;
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#fff',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    tabContainer: {
        display: 'flex',
        gap: '32px',
        borderBottom: '1px solid #eee',
        marginBottom: '24px',
        padding: '0 20px',
        width: '100%',
        position: 'relative',
    },
    tabButton: {
        padding: '12px 0',
        border: 'none',
        background: 'none',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
    },
    postGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        padding: '20px 0',
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    postHeader: {
        marginBottom: '16px',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    postTitleSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    title: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1c1e21',
        margin: '0',
    },
    postedBy: {
        margin: 0,
        fontSize: '14px',
        color: '#65676b',
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        backgroundColor: '#f0f2f5',
    },
    likeButton: {
        padding: '8px 0',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
        }
    },
    description: {
        margin: '0',
        fontSize: '14px',
        lineHeight: '1.4',
        color: '#65676b',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
    },
    modalContent: {
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalImage: {
        maxWidth: '100%',
        maxHeight: '90vh',
        objectFit: 'contain',
        borderRadius: '8px',
        animation: 'scaleIn 0.3s ease-out'
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '32px',
        cursor: 'pointer',
        padding: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
        }
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    deleteButton: {
        background: 'transparent',
        border: 'none',
        padding: '8px 0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc3545',
        transition: 'all 0.3s ease',
        '&:hover': {
            opacity: 0.8,
        }
    },
    deleteIcon: {
        fontSize: '20px',
        color: '#dc3545',
    },
    defaultProfilePic: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '600',
    },
    userProfilePic: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    tabTitle: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#007bff',
        marginBottom: '24px',
        textAlign: 'left',
        paddingLeft: '20px',
    },
};

export default InventionPage;

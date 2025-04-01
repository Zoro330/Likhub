import NavBar from "../components/Navigationbar";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { forumService } from "../services/api";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('Featured');
    const [activeSlide, setActiveSlide] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [forumPosts, setForumPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [commentInput, setCommentInput] = useState({});
    const [showComments, setShowComments] = useState({});
    const [activeForumTab, setActiveForumTab] = useState('All');
    const [showImageModal, setShowImageModal] = useState({});

    useEffect(() => {
        const fetchForumPosts = async () => {
            try {
                const data = await forumService.getPosts();
                setForumPosts(data);
            } catch (error) {
                console.error('Error fetching forum posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchForumPosts();
    }, []);

    const featuredInventions = [
        {
            id: 1,
            image: "/images/analytical-engine.jpg",
            title: "The Analytical Engine",
            description: "The Analytical Engine, designed by Charles Babbage in 1837, was a revolutionary digital mechanical general-purpose computer. It featured an arithmetic logic unit, control flow (conditional branching and loops), and memory, making it the first design for a Turing-complete computer. Though never fully constructed, its structure laid the foundation for modern computers. Konrad Zuse's Z3, built in 1941, became the first realized general-purpose computer, over a century later.",
            wikiLink: "https://en.wikipedia.org/wiki/Analytical_Engine"
        },
        {
            id: 2,
            image: "/images/first-airplane.jpg",
            title: "The First Airplane",
            description: "The Wright Flyer, also known as the Flyer I, was the first successful powered aircraft, designed and built by Orville and Wilbur Wright. It made its historic first flight on December 17, 1903, in Kitty Hawk, North Carolina. The first flight lasted 12 seconds and covered a distance of 120 feet, marking the beginning of controlled, sustained flight with a pilot aboard. Constructed from spruce wood and muslin fabric, the Flyer was powered by a 12-horsepower gasoline engine and had a wingspan of 40 feet 4 inches. The Wright brothers revolutionized aviation by developing a three-axis control system, which remains fundamental in modern aircraft. Today, the original Wright Flyer is displayed at the Smithsonian National Air and Space Museum in Washington, D.C. ",
            wikiLink: "https://en.wikipedia.org/wiki/Wright_Flyer"
        },
        {
            id: 3,
            image: "/images/first-car.jpg",
            title: "The First Car",
            description: "The Benz Patent-Motorwagen, invented by Karl Benz in 1885, was the world's first true automobile, powered by a single-cylinder, four-stroke gasoline engine producing 0.75 horsepower. Benz received a patent (No. 37435) for his invention on January 29, 1886, marking the birth of the modern car. In 1888, his wife, Bertha Benz, made history by driving 106 km (66 miles) from Mannheim to Pforzheim, proving the car's practicality and leading to important design improvements. This pioneering vehicle laid the foundation for the automobile industry, and today, it is preserved in museums like the Mercedes-Benz Museum in Stuttgart, Germany.",
            wikiLink: "https://en.wikipedia.org/wiki/Benz_Patent-Motorwagen"
        }
    ];

    const otherInventions = [
        { 
            id: 1, 
            image: "/images/vr-technology.jpg", 
            title: "Meta Quest",
            wikiLink: "https://www.meta.com/quest/"
        },
        { 
            id: 2, 
            image: "/images/robotic-arm.jpg", 
            title: "Robotic Arm",
            wikiLink: "https://www.kuka.com/en-us/products/robotics-systems/industrial-robots"
        },
        { 
            id: 3, 
            image: "/images/intel-cpu.webp", 
            title: "Intel Core i9-14900K",
            wikiLink: "https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i914900k-processor-36m-cache-up-to-6-00-ghz/specifications.html"
        },
        { 
            id: 4, 
            image: "/images/robot-dog.jpg", 
            title: "Go2 Robot Dog",
            wikiLink: "https://www.unitree.com/go2"
        }
    ];

    const handleNext = () => {
        setActiveSlide((prev) => (prev + 1) % featuredInventions.length);
    };

    const handlePrev = () => {
        setActiveSlide((prev) => (prev - 1 + featuredInventions.length) % featuredInventions.length);
    };

    const handleImageClick = () => {
        setShowDescription(!showDescription);
    };

    const handleLike = async (postId) => {
        try {
            if (!user) {
                alert("Please login to like posts");
                return;
            }

            // Check if user has already liked the post
            const post = forumPosts.find(p => p._id === postId);
            if (post?.likes?.includes(user?._id)) {
                alert("You have already liked this post!");
                return;
            }

            const updatedPost = await forumService.likePost(postId);
            
            setForumPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? updatedPost : post
                )
            );
        } catch (error) {
            console.error("Error liking post:", error);
            alert("Failed to like post. Please try again.");
        }
    };

    const handleComment = async (postId) => {
        try {
            if (!user) {
                alert("Please login to comment");
                return;
            }

            const content = commentInput[postId];
            if (!content?.trim()) {
                alert("Please enter a comment");
                return;
            }

            const commentData = {
                content: content.trim(),
                userId: user._id,
                userName: user.userName,
                userProfilePic: user.profilePic || ""
            };

            const updatedPost = await forumService.addComment(postId, commentData);
            
            setForumPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? updatedPost : post
                )
            );
            setCommentInput(prev => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert(error.message || "Failed to add comment");
        }
    };

    const getInitialsAvatar = (userName) => {
        if (!userName) return null;
        const initial = userName.charAt(0).toUpperCase();
        return (
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600'
            }}>
                {initial}
            </div>
        );
    };

    const getCommentInitialsAvatar = (userName) => {
        if (!userName) return null;
        const initial = userName.charAt(0).toUpperCase();
        return (
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                marginRight: '8px'
            }}>
                {initial}
            </div>
        );
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to delete posts");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/forum/${postId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            setForumPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            alert("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to delete comments");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/forum/${postId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete comment");
            }

            const updatedPost = await response.json();
            setForumPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? updatedPost : post
                )
            );
            alert("Comment deleted successfully!");
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment");
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
                            borderBottom: activeTab === 'Featured' ? '2px solid #007bff' : 'none',
                            color: activeTab === 'Featured' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('Featured')}
                        className={`tab-button ${activeTab === 'Featured' ? 'active' : ''}`}
                    >
                        Featured
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            borderBottom: activeTab === 'Forum' ? '2px solid #007bff' : 'none',
                            color: activeTab === 'Forum' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('Forum')}
                        className={`tab-button ${activeTab === 'Forum' ? 'active' : ''}`}
                    >
                        Forum
                    </button>
                </div>

                <div className="tab-content">
                    <div className={`tab-panel ${activeTab === 'Featured' ? 'active' : ''}`}>
                        {activeTab === 'Featured' && (
                            <>
                                <section style={styles.featuredSection}>
                                    <h2 style={styles.sectionTitle}>Featured Inventions</h2>
                                    <div style={styles.carousel}>
                                        <button 
                                            onClick={handlePrev} 
                                            style={styles.carouselButton}
                                            className="prev-button carousel-button"
                                        >
                                            ‹
                                        </button>
                                        <div style={styles.carouselTrack} className="carousel-track">
                                            {featuredInventions.map((invention, index) => (
                                                <div 
                                                    key={invention.id} 
                                                    className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
                                                    style={{
                                                        ...styles.carouselSlide,
                                                        transform: `translateX(${(index - activeSlide) * 100}%)`,
                                                        opacity: index === activeSlide ? 1 : 0,
                                                    }}
                                                >
                                                    <img 
                                                        src={invention.image} 
                                                        alt={invention.title} 
                                                        style={styles.carouselImage}
                                                        className="carousel-image"
                                                        onClick={handleImageClick}
                                                    />
                                                    {showDescription && index === activeSlide && (
                                                        <div style={styles.descriptionPanel} className="description-panel">
                                                            <div style={styles.descriptionContent} className="description-content">
                                                                <h3 style={styles.descriptionTitle}>
                                                                    {invention.title}
                                                                </h3>
                                                                <p style={styles.descriptionText}>
                                                                    {invention.description}
                                                                </p>
                                                                <div style={styles.buttonContainer}>
                                                                    <button 
                                                                        style={styles.backButton}
                                                                        className="featured-button"
                                                                        onClick={() => setShowDescription(false)}
                                                                    >
                                                                        Back
                                                                    </button>
                                                                    <a 
                                                                        href={invention.wikiLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ textDecoration: 'none' }}
                                                                    >
                                                                        <button style={styles.moreInfoButton} className="featured-button">
                                                                            More Info
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={handleNext} 
                                            style={styles.carouselButton}
                                            className="next-button carousel-button"
                                        >
                                            ›
                                        </button>
                                        <div style={styles.carouselDots}>
                                            {featuredInventions.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
                                                    style={{
                                                        ...styles.dot,
                                                        backgroundColor: index === activeSlide ? '#007bff' : '#ddd'
                                                    }}
                                                    onClick={() => setActiveSlide(index)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section style={styles.othersSection}>
                                    <h2 style={styles.sectionTitle}>Others</h2>
                                    <div style={styles.inventionsGrid}>
                                        {otherInventions.map(invention => (
                                            <a 
                                                key={invention.id} 
                                                href={invention.wikiLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div style={styles.inventionCard} className="invention-card">
                                                    <img 
                                                        src={invention.image} 
                                                        alt={invention.title} 
                                                        style={styles.inventionImage}
                                                        className="invention-image"
                                                    />
                                                    <div style={styles.inventionOverlay} className="invention-overlay">
                                                        <h3 style={styles.inventionTitle}>{invention.title}</h3>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                    <div className={`tab-panel ${activeTab === 'Forum' ? 'active' : ''}`}>
                        {activeTab === 'Forum' && (
                            <section style={styles.forumSection}>
                                <div style={styles.forumTabContainer}>
                                    <button 
                                        style={{
                                            ...styles.forumTabButton,
                                            color: activeForumTab === 'All Forums' ? '#007bff' : '#666'
                                        }}
                                        onClick={() => setActiveForumTab('All Forums')}
                                        className={`forum-tab-button ${activeForumTab === 'All Forums' ? 'active' : ''}`}
                                    >
                                        All Forums
                                    </button>
                                    <button 
                                        style={{
                                            ...styles.forumTabButton,
                                            color: activeForumTab === 'My Forums' ? '#007bff' : '#666'
                                        }}
                                        onClick={() => setActiveForumTab('My Forums')}
                                        className={`forum-tab-button ${activeForumTab === 'My Forums' ? 'active' : ''}`}
                                    >
                                        My Forums
                                    </button>
                                </div>
                                {loading ? (
                                    <div style={styles.loading}>Loading...</div>
                                ) : (
                                    <div style={styles.forumPosts}>
                                        {(activeForumTab === 'All Forums' ? forumPosts : forumPosts.filter(post => post.userId === user?._id))
                                            .map(post => (
                                            <div key={post._id} style={styles.forumPost}>
                                                <div style={styles.postHeader}>
                                                    <div style={styles.userInfo}>
                                                        {post.userProfilePic ? (
                                                    <img 
                                                                src={post.userProfilePic} 
                                                        alt={post.userName} 
                                                        style={styles.userAvatar}
                                                    />
                                                        ) : (
                                                            getInitialsAvatar(post.userName)
                                                        )}
                                                    <div style={styles.postInfo}>
                                                        <h3 style={styles.postTitle}>{post.title}</h3>
                                                        <p style={styles.postAuthor}>Posted by {post.userName}</p>
                                                    </div>
                                                </div>
                                                    {activeForumTab === 'My Forums' && (
                                                        <button 
                                                            onClick={() => handleDeletePost(post._id)}
                                                            style={styles.deleteButton}
                                                            title="Delete post"
                                                        >
                                                            <i className="fas fa-trash" style={styles.deleteIcon}></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div style={styles.postContent}>
                                                <p style={styles.postDescription}>{post.description}</p>
                                                {post.image && (
                                                        <div style={{ position: 'relative' }}>
                                                    <img 
                                                        src={post.image} 
                                                        alt={post.title} 
                                                                style={{
                                                                    ...styles.postImage,
                                                                    cursor: 'pointer',
                                                                    transition: 'transform 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.02)',
                                                                    }
                                                                }}
                                                                onClick={() => setShowImageModal(prev => ({ ...prev, [post._id]: true }))}
                                                            />
                                                            {showImageModal[post._id] && (
                                                                <div 
                                                                    style={styles.imageModal}
                                                                    onClick={() => setShowImageModal(prev => ({ ...prev, [post._id]: false }))}
                                                                    className="image-modal"
                                                                >
                                                                    <button 
                                                                        style={styles.closeModalButton}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowImageModal(prev => ({ ...prev, [post._id]: false }));
                                                                        }}
                                                                        className="close-modal-button"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                    <img 
                                                                        src={post.image} 
                                                                        alt={post.title} 
                                                                        style={styles.modalImage}
                                                                        className="modal-image"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                )}
                                                <div style={styles.postFooter}>
                                                    <div style={styles.postActions}>
                                                        <button 
                                                                onClick={() => handleLike(post._id)}
                                                            style={{
                                                                ...styles.actionButton,
                                                                color: post.likes?.includes(user?._id) ? '#007bff' : '#666',
                                                                    padding: '8px 0',
                                                                    backgroundColor: 'transparent',
                                                                border: 'none',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                    gap: '6px',
                                                                    transition: 'all 0.3s ease',
                                                            }}
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
                                                            style={{
                                                                ...styles.actionButton,
                                                                color: showComments[post._id] ? '#007bff' : '#666',
                                                                    padding: '8px 0',
                                                                    backgroundColor: 'transparent',
                                                                border: 'none',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                    gap: '6px',
                                                                    transition: 'all 0.3s ease',
                                                                    marginLeft: '16px',
                                                            }}
                                                            onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                                                        >
                                                            <img 
                                                                src="/images/comment-icon.png" 
                                                                alt="Comment" 
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                        filter: showComments[post._id] 
                                                                            ? 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1234%) hue-rotate(210deg) brightness(97%) contrast(101%)'
                                                                            : 'brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%)'
                                                                }}
                                                            />
                                                                <span>{post.comments?.length || 0}</span>
                                                        </button>
                                                    </div>
                                                    <span style={styles.postDate}>
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                {showComments[post._id] && (
                                                    <div style={{
                                                        marginTop: '16px',
                                                        paddingTop: '16px',
                                                            borderTop: '1px solid #eee',
                                                            marginLeft: '0',
                                                            width: '100%'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '16px'
                                                        }}>
                                                            <h4 style={{ margin: 0, color: '#1c1e21', fontSize: '16px', fontWeight: '600' }}>
                                                                Comments
                                                            </h4>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                                marginBottom: '20px'
                                                        }}>
                                                                {user?.profilePic ? (
                                                            <img 
                                                                        src={user.profilePic}
                                                                alt="Your avatar"
                                                                style={styles.commentUserPic}
                                                            />
                                                                ) : (
                                                                    getCommentInitialsAvatar(user?.userName)
                                                                )}
                                                            <input
                                                                type="text"
                                                                value={commentInput[post._id] || ""}
                                                                onChange={(e) => setCommentInput(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        if (commentInput[post._id]?.trim()) {
                                                                            handleComment(post._id);
                                                                        }
                                                                    }
                                                                }}
                                                                placeholder="Write a comment..."
                                                                style={{
                                                                    flex: 1,
                                                                        height: '36px',
                                                                        padding: '0 16px',
                                                                    border: '1px solid #ccd0d5',
                                                                        borderRadius: '18px',
                                                                        fontSize: '14px',
                                                                    backgroundColor: '#f0f2f5',
                                                                        color: '#1c1e21',
                                                                        outline: 'none',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    onFocus={(e) => {
                                                                        e.target.style.borderColor = '#007bff';
                                                                        e.target.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.1)';
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        e.target.style.borderColor = '#ccd0d5';
                                                                        e.target.style.boxShadow = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '16px'
                                                            }}>
                                                                {post.comments?.map((comment, index) => (
                                                                    <div key={index} style={{
                                                                        display: 'flex',
                                                                        alignItems: 'flex-start',
                                                                        gap: '8px',
                                                                        padding: '12px',
                                                                        backgroundColor: '#f0f2f5',
                                                                        borderRadius: '12px',
                                                                        position: 'relative'
                                                                    }}>
                                                                        {comment.userProfilePic ? (
                                                                            <img 
                                                                                src={comment.userProfilePic} 
                                                                                alt={comment.userName} 
                                                                                style={styles.commentUserPic}
                                                                            />
                                                                        ) : (
                                                                            getCommentInitialsAvatar(comment.userName)
                                                                        )}
                                                                        <div style={{
                                                                            flex: 1,
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            gap: '4px'
                                                                        }}>
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center'
                                                                            }}>
                                                                                <span style={{
                                                                                    fontWeight: '600',
                                                                                    color: '#1c1e21',
                                                                                    fontSize: '13px'
                                                                                }}>
                                                                                {comment.userName}
                                                                            </span>
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '8px'
                                                                            }}>
                                                                                <span style={{
                                                                                    fontSize: '12px',
                                                                                    color: '#65676b'
                                                                                }}>
                                                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                                                </span>
                                                                                {user && (user._id === comment.userId || user._id === post.userId) && (
                                                                                    <button
                                                                                        onClick={() => handleDeleteComment(post._id, comment._id)}
                                                                                        style={{
                                                                                            background: 'none',
                                                                                            border: 'none',
                                                                                            padding: '4px',
                                                                                            cursor: 'pointer',
                                                                                            color: '#dc3545',
                                                                                            transition: 'all 0.3s ease',
                                                                                            '&:hover': {
                                                                                                opacity: 0.8,
                                                                                            }
                                                                                        }}
                                                                                        title="Delete comment"
                                                                                    >
                                                                                        <i className="fas fa-trash" style={{ fontSize: '14px' }}></i>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <p style={{
                                                                            margin: 0,
                                                                            fontSize: '14px',
                                                                            lineHeight: '1.4',
                                                                            color: '#1c1e21'
                                                                        }}>
                                                                            {comment.content}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
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
                    
                    .tab-indicator {
                        position: absolute;
                        bottom: -2px;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background-color: #007bff;
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    .tab-content {
                        position: relative;
                        min-height: 200px;
                    }
                    
                    .tab-panel {
                        position: absolute;
                        width: 100%;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.3s ease-out;
                        pointer-events: none;
                    }
                    
                    .tab-panel.active {
                        opacity: 1;
                        transform: translateY(0);
                        position: relative;
                        pointer-events: all;
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: scaleX(0);
                        }
                        to {
                            transform: scaleX(1);
                        }
                    }
                    
                    .carousel-track {
                        position: relative;
                        height: 100%;
                        overflow: hidden;
                    }
                    
                    .carousel-slide {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        transition: all 0.5s ease-in-out;
                        opacity: 0;
                    }
                    
                    .carousel-slide.active {
                        opacity: 1;
                    }
                    
                    .carousel-image {
                        cursor: pointer;
                        transition: transform 0.3s ease;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        padding: '20px',
                    }
                    
                    .carousel-image:hover {
                        transform: scale(1.02);
                    }
                    
                    .carousel-button {
                        opacity: 0.7;
                        transition: all 0.3s ease !important;
                    }
                    
                    .carousel-button:hover {
                        opacity: 1;
                        background-color: rgba(0, 123, 255, 0.8) !important;
                        transform: translateY(-50%) scale(1.1) !important;
                    }
                    
                    .carousel-dot {
                        transition: all 0.3s ease;
                        transform: scale(1);
                    }
                    
                    .carousel-dot:hover {
                        transform: scale(1.2);
                    }
                    
                    .carousel-dot.active {
                        transform: scale(1.2);
                    }
                    
                    .description-panel {
                        animation: slideIn 0.3s ease-out;
                        background-color: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(5px);
                    }
                    
                    .description-content {
                        animation: fadeIn 0.4s ease-out;
                    }
                    
                    .featured-button {
                        transition: all 0.3s ease !important;
                    }
                    
                    .featured-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    .prev-button {
                        left: 20px;
                    }
                    .next-button {
                        right: 20px;
                    }
                    .invention-card {
                        position: relative;
                        overflow: hidden;
                    }
                    .invention-card:hover .invention-overlay {
                        opacity: 1 !important;
                    }
                    .invention-card:hover .invention-image {
                        transform: scale(1.05);
                    }
                    .invention-overlay {
                        pointer-events: none;
                    }
                    .forumSection {
                        padding: '20px',
                        maxWidth: '800px',
                        margin: '0 auto'
                    },
                    .forumPosts {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    },
                    .forumPost {
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        border: '1px solid #eee',
                        marginBottom: '16px'
                    },
                    .postHeader {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                    },
                    .userInfo {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        flex: 1
                    },
                    .userAvatar {
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    },
                    .postInfo {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    },
                    .postTitle {
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1c1e21'
                    },
                    .postAuthor {
                        margin: 0,
                        fontSize: '14px',
                        color: '#65676b'
                    },
                    .postContent: {
                        marginLeft: '0',
                        width: '100%'
                    },
                    .postDescription {
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        color: '#1c1e21'
                    },
                    .postImage {
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    }
                    
                    .postImage:hover {
                        transform: scale(1.02);
                    }
                    
                    .postFooter {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '12px',
                        borderTop: '1px solid #eee',
                        width: '100%'
                    },
                    .postDate {
                        fontSize: '14px',
                        color: '#65676b'
                    },
                    .postActions {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    },
                    .likeButton {
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    },
                    .loading {
                        textAlign: 'center',
                        padding: '20px',
                        fontSize: '16px',
                        color: '#666'
                    },
                    .actionButton: {
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        }
                    },
                    .actionCount: {
                        fontWeight: '500',
                        fontSize: '14px',
                    },
                    .commentsSection: {
                        marginTop: '8px',
                        paddingTop: '8px',
                    },
                    .commentInputContainer: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        padding: '0 4px',
                    },
                    .commentUserAvatar: {
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    },
                    .commentInput: {
                        flex: 1,
                        height: '32px',
                        padding: '0 12px',
                        border: '1px solid #ccd0d5',
                        borderRadius: '4px',
                        fontSize: '13px',
                        backgroundColor: '#fff',
                        '&::placeholder': {
                            color: '#606770',
                        },
                        '&:focus': {
                            outline: 'none',
                            borderColor: '#ccd0d5',
                        },
                    },
                    .commentsList: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    },
                    .comment: {
                        padding: '8px 0',
                    },
                    .commentHeader: {
                        padding: '8px 12px',
                        backgroundColor: '#f0f2f5',
                        borderRadius: '8px',
                        width: '100%'
                    },
                    .commentUserPic: {
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        objectFit: "cover"
                    },
                    .commentAuthor: {
                        fontWeight: '600',
                        color: '#1c1e21',
                        fontSize: '13px'
                    },
                    .commentDate: {
                        fontSize: '12px',
                        color: '#65676b'
                    },
                    .commentContent: {
                        fontSize: '13px',
                        lineHeight: '1.4',
                        color: '#1c1e21',
                        marginTop: '4px'
                    },
                    .action-button {
                        transition: all 0.3s ease;
                    }
                    
                    .action-button:hover {
                        background-color: rgba(0, 123, 255, 0.1);
                    }
                    
                    .action-button:active {
                        transform: scale(0.95);
                    }
                    
                    .action-button img {
                        transition: transform 0.3s ease;
                    }
                    
                    .action-button:hover img {
                        transform: scale(1.1);
                    }
                    
                    .commentTextarea:focus {
                        outline: none;
                        border-color: #007bff;
                        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
                    }
                    
                    .commentButton:disabled {
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                    
                    .comment {
                        transition: transform 0.2s ease;
                    }
                    
                    .comment:hover {
                        transform: translateX(4px);
                    }
                    
                    input[type="text"] {
                        flex: 1;
                        height: 32px;
                        padding: 0 12px;
                        border: 1px solid #ccd0d5;
                        border-radius: 4px;
                        font-size: 13px;
                        background-color: #fff;
                        color: #1c1e21;
                    }

                    input[type="text"]::placeholder {
                        color: #606770;
                    }

                    input[type="text"]:focus {
                        outline: none;
                        border-color: #007bff;
                        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
                    }

                    .commentUserPic: {
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        objectFit: "cover"
                    },
                    .commentDefaultPic: {
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        backgroundColor: "#FFD700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#222"
                    },
                    .commentContainer: {
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                        padding: "8px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px"
                    },
                    .forumTabContainer: {
                        display: 'flex',
                        gap: '32px',
                        borderBottom: '1px solid #eee',
                        marginBottom: '24px',
                        padding: '0 20px',
                    },
                    .forumTabButton: {
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
                    .forumTabIndicator: {
                        position: 'absolute',
                        bottom: '-1px',
                        left: 0,
                        width: '0',
                        height: '2px',
                        backgroundColor: '#007bff',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(0)'
                    },
                    .deleteButton: {
                        background: 'transparent',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#dc3545',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            opacity: 0.8,
                        }
                    },
                    .deleteIcon: {
                        fontSize: '18px',
                    },
                    .image-modal {
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
                    .modal-image {
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        animation: 'scaleIn 0.3s ease-out'
                    },
                    .closeModalButton: {
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
                    .forum-tab-button {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .forum-tab-button::after {
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
                    
                    .forum-tab-button:hover::after {
                        width: 100%;
                    }
                    
                    .forum-tab-button.active::after {
                        width: 100%;
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
    featuredSection: {
        marginBottom: '40px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#007bff',
    },
    carousel: {
        position: 'relative',
        width: '100%',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #eee',
        maxWidth: '800px',
        margin: '0 auto',
    },
    carouselTrack: {
        height: '100%',
        position: 'relative',
    },
    carouselSlide: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        padding: '20px',
    },
    carouselDots: {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    othersSection: {
        marginBottom: '40px',
    },
    inventionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        padding: '20px 0',
    },
    inventionCard: {
        position: 'relative',
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #eee',
        backgroundColor: '#f8f9fa',
    },
    inventionImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    inventionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
    },
    inventionTitle: {
        color: '#fff',
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        textAlign: 'center',
        padding: '0 20px',
        textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    },
    carouselButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '24px',
        zIndex: 2,
        transition: 'all 0.3s ease',
    },
    descriptionPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 3,
    },
    descriptionContent: {
        maxWidth: '600px',
        textAlign: 'left',
        padding: '20px',
    },
    descriptionTitle: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#333',
    },
    descriptionText: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#666',
        marginBottom: '24px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-start',
    },
    backButton: {
        padding: '8px 24px',
        backgroundColor: '#f0f0f0',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#333',
        transition: 'background-color 0.3s ease',
    },
    moreInfoButton: {
        padding: '8px 24px',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'white',
        transition: 'background-color 0.3s ease',
    },
    forumSection: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    forumPosts: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    forumPost: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
        marginBottom: '16px'
    },
    postHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        flex: 1
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    postInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    postTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: '#1c1e21'
    },
    postAuthor: {
        margin: 0,
        fontSize: '14px',
        color: '#65676b'
    },
    postContent: {
        marginLeft: '0',
        width: '100%'
    },
    postDescription: {
        margin: '0 0 16px 0',
        fontSize: '14px',
        lineHeight: '1.4',
        color: '#1c1e21'
    },
    postImage: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '16px'
    },
    postFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #eee',
        width: '100%'
    },
    postDate: {
        fontSize: '14px',
        color: '#65676b'
    },
    postActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    likeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '16px',
        color: '#666'
    },
    commentUserPic: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        marginRight: "8px",
        objectFit: "cover"
    },
    commentDefaultPic: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        marginRight: "8px",
        backgroundColor: "#FFD700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "600",
        color: "#222"
    },
    commentContainer: {
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "8px",
        padding: "8px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
    },
    commentAvatar: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        marginRight: "8px",
        objectFit: "cover"
    },
    forumTabContainer: {
        display: 'flex',
        gap: '32px',
        borderBottom: '1px solid #eee',
        marginBottom: '24px',
        padding: '0 20px',
    },
    forumTabButton: {
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
    forumTabIndicator: {
        position: 'absolute',
        bottom: '-1px',
        left: 0,
        width: '0',
        height: '2px',
        backgroundColor: '#007bff',
        transition: 'all 0.3s ease',
        transform: 'translateX(0)'
    },
    deleteButton: {
        background: 'transparent',
        border: 'none',
        padding: '8px',
        cursor: 'pointer',
        color: '#dc3545',
        transition: 'all 0.3s ease',
        '&:hover': {
            opacity: 0.8,
        }
    },
    deleteIcon: {
        fontSize: '18px',
    },
    imageModal: {
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
    modalImage: {
        maxWidth: '90%',
        maxHeight: '90vh',
        objectFit: 'contain',
        borderRadius: '8px',
        animation: 'scaleIn 0.3s ease-out'
    },
    closeModalButton: {
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
};

export default HomePage;

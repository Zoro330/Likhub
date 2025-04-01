import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    const slides = [
        {
            image: "/images/invention-icon.png",
            title: "INNOVATIONS WITHOUT BORDERS, IMPACT WITHOUT LIMITS."
        },
        // Add more slides here if needed
    ];

    return (
        <>
            <style>
                {`
                    .hero-title {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards;
                    }

                    .hero-image {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards 0.3s;
                    }

                    .join-button {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards 0.6s;
                        transition: all 0.3s ease;
                    }

                    .join-button:hover {
                        transform: translateY(-2px) scale(1.05);
                        background: #0056b3;
                        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
                    }

                    .category-card {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards;
                        transition: all 0.3s ease;
                    }

                    .category-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    }

                    .category-card img {
                        transition: transform 0.3s ease;
                    }

                    .category-card:hover img {
                        transform: scale(1.1);
                    }

                    .section-title {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards;
                    }

                    .section-text {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInUp 0.8s ease forwards 0.3s;
                    }

                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .nav-button {
                        transition: all 0.3s ease;
                    }

                    .nav-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                `}
            </style>
            <div style={styles.container}>
                {/* Navigation Bar */}
                <nav style={styles.nav}>
                    <div style={styles.logoContainer}>
                        <img src="/images/Likhub-logo.png" alt="LikHub" style={styles.brandLogo} />
                    </div>
                    <div style={styles.navButtons}>
                        <button style={styles.signUpButton} onClick={() => navigate("/signup")} className="nav-button">Sign up</button>
                        <button style={styles.logInButton} onClick={() => navigate("/login")} className="nav-button">Log in</button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle} className="hero-title">{slides[0].title}</h1>
                        <button style={styles.joinButton} onClick={() => navigate("/signup")} className="join-button">Join now</button>
                    </div>
                    <div style={styles.heroImage}>
                        <img src={slides[0].image} alt="Innovation" className="hero-image" style={{
                            ...styles.slideImage,
                            width: "400px",
                            height: "400px",
                            objectFit: "contain"
                        }} />
                    </div>
                </div>

                {/* Categories Section */}
                <div style={styles.categories}>
                    <div style={styles.categoryCard} className="category-card">
                        <img src="/images/innovation-icon.png" alt="Innovations" style={styles.categoryImage} />
                        <h3 style={styles.categoryTitle}>Innovations</h3>
                        <p style={styles.categoryDesc}>New and improved ideas, methods, or products that bring progress and change.</p>
                    </div>
                    <div style={styles.categoryCard} className="category-card">
                        <img src="/images/creation-icon.png" alt="Creation" style={styles.categoryImage} />
                        <h3 style={styles.categoryTitle}>Creation</h3>
                        <p style={styles.categoryDesc}>Things that are made or brought into existence, often emphasizing originality.</p>
                    </div>
                    <div style={styles.categoryCard} className="category-card">
                        <img src="/images/discovery-icon.png" alt="Discoveries" style={styles.categoryImage} />
                        <h3 style={styles.categoryTitle}>Discoveries</h3>
                        <p style={styles.categoryDesc}>Findings of something previously unknown, whether in science, nature, or ideas.</p>
                    </div>
                    <div style={styles.categoryCard} className="category-card">
                        <img src="/images/development-icon.png" alt="Development" style={styles.categoryImage} />
                        <h3 style={styles.categoryTitle}>Development</h3>
                        <p style={styles.categoryDesc}>The process of growth, improvement, or advancement in a particular field.</p>
                    </div>
                </div>

                {/* Mission and Vision Section */}
                <div style={styles.missionVision}>
                    <div style={styles.missionSection}>
                        <h2 style={styles.sectionTitle} className="section-title">Mission</h2>
                        <p style={styles.sectionText} className="section-text">
                            Our mission is to inspire innovation by showcasing witty inventions, 
                            providing a platform for inventors to share their creations, and
                            fostering a community about technological advancement and creative
                            solutions.
                        </p>
                    </div>
                    <div style={styles.visionSection}>
                        <h2 style={styles.sectionTitle} className="section-title">Vision</h2>
                        <p style={styles.sectionText} className="section-text">
                            Our vision is to become the go to website for people looking for
                            invention discovery, inspiring future innovators and contributing to the
                            society where creative ideas transform lives and drive
                            progress.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer style={styles.footer}>
                    <div style={styles.footerSection}>
                        <h4>Contact us</h4>
                        <a href="/contact">Contact us</a>
                        <a href="/terms">Term of service</a>
                        <a href="/privacy">Privacy Policy</a>
                    </div>
                    <div style={styles.footerSection}>
                        <h4>Company</h4>
                        <a href="/terms">Term of service</a>
                        <a href="/advertise">Advertise</a>
                        <a href="/about">About us</a>
                    </div>
                </footer>
            </div>
        </>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
    },
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoImage: {
        width: "30px",
        height: "30px",
        objectFit: "contain",
    },
    brandLogo: {
        height: "45px",
        objectFit: "contain",
    },
    navButtons: {
        display: "flex",
        gap: "20px",
    },
    signUpButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        background: "transparent",
        color: "#333",
        cursor: "pointer",
        fontSize: "16px",
    },
    logInButton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        background: "#007bff",
        color: "white",
        cursor: "pointer",
        fontSize: "16px",
    },
    hero: {
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
    },
    heroContent: {
        flex: 1,
        padding: "150px 50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    heroTitle: {
        fontSize: "48px",
        fontWeight: "700",
        maxWidth: "600px",
        lineHeight: "1.2",
        marginBottom: "30px",
    },
    joinButton: {
        padding: "15px 30px",
        border: "none",
        borderRadius: "5px",
        background: "#007bff",
        color: "white",
        fontSize: "18px",
        cursor: "pointer",
        width: "fit-content",
    },
    heroImage: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    slideImage: {
        maxWidth: "100%",
        height: "auto",
    },
    categories: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "30px",
        padding: "50px",
        background: "#f5f5f5",
    },
    categoryCard: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    categoryImage: {
        width: "100px",
        height: "100px",
        marginBottom: "20px",
    },
    categoryTitle: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "10px",
    },
    categoryDesc: {
        fontSize: "14px",
        color: "#666",
        lineHeight: "1.5",
    },
    footer: {
        display: "flex",
        justifyContent: "space-around",
        padding: "50px",
        background: "#1a1a1a",
        color: "white",
    },
    footerSection: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    "footerSection a": {
        color: "#999",
        textDecoration: "none",
        fontSize: "14px",
    },
    "footerSection h4": {
        marginBottom: "20px",
        fontSize: "18px",
    },
    missionVision: {
        padding: "80px 50px",
        background: "#fff",
        display: "flex",
        gap: "50px",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    missionSection: {
        flex: 1,
        maxWidth: "500px",
    },
    visionSection: {
        flex: 1,
        maxWidth: "500px",
    },
    sectionTitle: {
        fontSize: "32px",
        fontWeight: "600",
        marginBottom: "20px",
        color: "#007bff",
    },
    sectionText: {
        fontSize: "16px",
        lineHeight: "1.8",
        color: "#444",
    },
};

export default Landing;

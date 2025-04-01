import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const success = await login(email, password);
            if (success) {
                navigate("/home");
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <>
            <style>
                {`
                    .input-field {
                        transition: all 0.3s ease !important;
                    }
                    .input-field:focus {
                        border: 2px solid #007bff !important;
                        box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1) !important;
                    }
                    .input-field:focus + label {
                        color: #007bff !important;
                    }
                    .error-message {
                        color: #dc3545;
                        background-color: #f8d7da;
                        border: 1px solid #f5c6cb;
                        border-radius: 4px;
                        padding: 10px;
                        margin-bottom: 20px;
                        font-size: 14px;
                        animation: fadeIn 0.3s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div style={styles.container}>
                {/* Left Section */}
                <div style={styles.leftSection}>
                    <div style={styles.logoContainer}>
                        <img 
                            src="/images/Likhub-logo.png" 
                            alt="LikHub" 
                            style={{ ...styles.logo, cursor: "pointer" }}
                            onClick={handleLogoClick}
                        />
                    </div>
                    <div style={styles.formContainer}>
                        <h1 style={styles.title}>Welcome back</h1>
                        <p style={styles.subtitle}>Please enter your details</p>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label htmlFor="email" style={styles.label}>Email address</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                    className="input-field"
                                    required
                                />
                            </div>
                            
                            <div style={styles.inputGroup}>
                                <label htmlFor="password" style={styles.label}>Password</label>
                                <div style={styles.passwordContainer}>
                                    <input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={styles.input}
                                        className="input-field"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        style={styles.showPasswordButton}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" style={styles.signInButton}>
                                Sign in
                            </button>

                            <p style={styles.signupText}>
                                Don't have an account? <Link to="/signup" style={styles.signupLink}>Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right Section */}
                <div style={styles.rightSection}>
                    <div style={styles.contentBox}>
                        <div style={styles.card}>
                            <div style={styles.cardContent}>
                                <h2 style={styles.rightTitle}>Innovation without borders,</h2>
                                <img 
                                    src="/images/invention-icon.png" 
                                    alt="Innovation" 
                                    style={styles.rightImage}
                                />
                                <h2 style={styles.rightTitle}>Impact without limits.</h2>
                            </div>
                        </div>
                    </div>
                    <div style={styles.overlay}></div>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
    },
    leftSection: {
        flex: "1",
        display: "flex",
        flexDirection: "column",
        position: "relative",
    },
    rightSection: {
        flex: "1",
        background: "#007bff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundImage: "linear-gradient(45deg, #007bff 0%, #007bff 100%)",
    },
    logoContainer: {
        position: "absolute",
        top: "20px",
        left: "50px",
        display: "flex",
        alignItems: "center",
    },
    logo: {
        height: "45px",
        objectFit: "contain",
    },
    formContainer: {
        maxWidth: "400px",
        width: "100%",
        margin: "120px auto 0",
        padding: "0",
    },
    title: {
        fontSize: "32px",
        fontWeight: "600",
        marginBottom: "8px",
        color: "#333",
        paddingLeft: "0",
    },
    subtitle: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "32px",
        paddingLeft: "0",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        padding: "0",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
    },
    label: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#333",
        transition: "color 0.3s ease",
    },
    "label:focus-within": {
        color: "#007bff",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "16px",
        outline: "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
    },
    "input:focus": {
        border: "2px solid #007bff",
        boxShadow: "0 0 0 4px rgba(0, 123, 255, 0.1)",
    },
    signInButton: {
        width: "100%",
        padding: "12px",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background 0.2s",
        boxSizing: "border-box",
        '&:hover': {
            background: "#0056b3",
        },
    },
    signupText: {
        textAlign: "center",
        fontSize: "14px",
        color: "#666",
    },
    signupLink: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "500",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"rgba(255,255,255,0.1)\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
        opacity: 0.6,
        zIndex: 0,
    },
    contentBox: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        zIndex: 1,
    },
    card: {
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        padding: "40px",
        width: "400px",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        overflow: "hidden",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
    },
    rightTitle: {
        fontSize: "24px",
        fontWeight: "600",
        lineHeight: "1.3",
        textAlign: "center",
        color: "white",
        whiteSpace: "nowrap",
    },
    rightImage: {
        width: "300px",
        height: "300px",
        objectFit: "contain",
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
    },
    passwordContainer: {
        position: "relative",
        width: "100%",
    },
    showPasswordButton: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#007bff",
        cursor: "pointer",
        fontSize: "14px",
        padding: "5px",
        fontWeight: "500",
    },
};

export default Login;

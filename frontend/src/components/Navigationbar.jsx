import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const { user, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logoLink}>
                    <div style={styles.logoContainer}>
                        <img src="/images/Likhub-logoWhite.png" alt="Likhub Logo" style={styles.logo} />
                    </div>
                </Link>
                <div style={styles.links}>
                    <NavLink 
                        to="/home" 
                        style={({ isActive }) => ({
                            ...styles.link,
                            color: isActive ? '#007bff' : '#fff',
                            fontWeight: isActive ? '600' : '500'
                        })}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/invention" 
                        style={({ isActive }) => ({
                            ...styles.link,
                            color: isActive ? '#007bff' : '#fff',
                            fontWeight: isActive ? '600' : '500'
                        })}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Inventions
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        style={({ isActive }) => ({
                            ...styles.link,
                            color: isActive ? '#007bff' : '#fff',
                            fontWeight: isActive ? '600' : '500'
                        })}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        About us
                    </NavLink>
                </div>
                <div style={styles.rightSection}>
                    {user ? (
                        <div style={styles.profileContainer}>
                            <div style={styles.profileWrapper} onClick={handleProfileClick}>
                                {user.profilePic ? (
                                    <img 
                                        src={user.profilePic} 
                                        alt={user.userName} 
                                        style={styles.avatar} 
                                        className="avatar" 
                                    />
                                ) : (
                                    <div style={{
                                        ...styles.avatar,
                                        backgroundColor: '#007bff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '500',
                                        fontSize: '16px'
                                    }} className="avatar">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                {showDropdown && (
                                    <div style={styles.dropdown}>
                                        <Link to="/profile" style={styles.dropdownItem}>
                                            <i className="fas fa-user" style={styles.dropdownIcon}></i>
                                            View Profile
                                        </Link>
                                        <button onClick={handleLogout} style={styles.dropdownItem}>
                                            <i className="fas fa-sign-out-alt" style={styles.dropdownIcon}></i>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={styles.authButtons}>
                            <Link to="/login" style={styles.loginButton}>Login</Link>
                            <Link to="/signup" style={styles.signupButton}>Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
            <style>
                {`
                    .nav-link {
                        position: relative;
                        color: #fff;
                        text-decoration: none;
                        opacity: 0.7;
                        transform: translateY(0);
                        transition: all 0.3s ease;
                        padding: 8px 0;
                    }
                    
                    .nav-link.active {
                        color: #007bff;
                        opacity: 1;
                        transform: translateY(-2px);
                        font-weight: 600;
                    }
                    
                    .nav-link.active::after {
                        width: 100%;
                        background-color: #007bff;
                    }
                    
                    .nav-link::after {
                        content: '';
                        position: absolute;
                        width: 0;
                        height: 2px;
                        bottom: -4px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #007bff;
                        transition: width 0.3s ease;
                    }
                    
                    .nav-link:hover::after {
                        width: 100%;
                    }
                    
                    .nav-link:hover {
                        color: #007bff;
                        opacity: 1;
                        transform: translateY(-2px);
                        font-weight: 600;
                    }
                    
                    .icon-button {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .icon-button::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 0;
                        height: 0;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        transition: width 0.3s ease, height 0.3s ease;
                    }
                    
                    .icon-button:hover::before {
                        width: 100%;
                        height: 100%;
                    }
                    
                    .avatar {
                        transform: scale(1);
                        transition: all 0.3s ease !important;
                    }
                    
                    .avatar:hover {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 2px #007bff;
                    }
                `}
            </style>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#1a1a1a',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    logoLink: {
        textDecoration: 'none',
        marginRight: '48px',
        marginLeft: '-60px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        height: '32px',
        width: 'auto',
        objectFit: 'contain',
    },
    links: {
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    link: {
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'all 0.3s ease',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginLeft: '48px',
        marginRight: '-60px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        padding: '8px',
        cursor: 'pointer',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    icon: {
        color: '#fff',
        fontSize: '20px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '2px solid transparent',
        transition: 'border-color 0.3s ease',
        ':hover': {
            borderColor: '#007bff',
        },
    },
    profileContainer: {
        position: 'relative',
        marginLeft: 'auto',
    },
    profileWrapper: {
        cursor: 'pointer',
        position: 'relative',
    },
    dropdown: {
        position: 'absolute',
        top: '120%',
        right: 0,
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '8px 0',
        minWidth: '180px',
        zIndex: 1000,
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '14px',
        border: 'none',
        background: 'none',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    dropdownIcon: {
        marginRight: '10px',
        fontSize: '16px',
        width: '20px',
        color: '#666',
    },
    authButtons: {
        display: 'flex',
        gap: '16px',
    },
    loginButton: {
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 16px',
        border: '1px solid #007bff',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#007bff',
        },
    },
    signupButton: {
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 16px',
        border: '1px solid #007bff',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: '#007bff',
        },
    },
};

export default NavBar;
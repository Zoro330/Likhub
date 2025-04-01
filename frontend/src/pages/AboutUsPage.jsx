import NavBar from "../components/Navigationbar";
import { useState } from "react";

const AboutUsPage = () => {
    const [activeTab, setActiveTab] = useState('Information');

    return (
        <div style={styles.container}>
            <NavBar />
            <div style={styles.content}>
                <div style={styles.tabContainer}>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'Information' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('Information')}
                        className={`tab-button ${activeTab === 'Information' ? 'active' : ''}`}
                    >
                        Information
                    </button>
                    <button 
                        style={{
                            ...styles.tabButton,
                            color: activeTab === 'Team' ? '#007bff' : '#666'
                        }}
                        onClick={() => setActiveTab('Team')}
                        className={`tab-button ${activeTab === 'Team' ? 'active' : ''}`}
                    >
                        Team
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'Information' && (
                        <div className="tab-panel active">
                            <h1 style={styles.title}>About us</h1>
                            <div style={styles.description}>
                                <h2 style={styles.subtitle}>Likhub</h2>
                                <p style={styles.text}>
                                    We showcase ingenious inventions and provide a platform for inventors to share their creations. Our goal is to foster a thriving community where innovation thrives, inspiring future innovators and driving meaningful progress. Whether you're an inventor or a tech enthusiast, our platform connects and celebrates creativity.
                                </p>
                            </div>
                            <div style={styles.featuresContainer}>
                                <div style={styles.featureCard} className="feature-card">
                                    <img 
                                        src="/images/3d-printer.jpg" 
                                        alt="New Ideas" 
                                        style={styles.featureImage}
                                    />
                                    <p style={styles.featureText}>
                                        New and improved ideas, methods, or products that bring progress and change.
                                    </p>
                                </div>
                                <div style={styles.featureCard} className="feature-card">
                                    <img 
                                        src="/images/vr-technology.jpg" 
                                        alt="Innovations" 
                                        style={styles.featureImage}
                                    />
                                    <p style={styles.featureText}>
                                        Things that are made or brought into existence, often emphasizing originality.
                                    </p>
                                </div>
                                <div style={styles.featureCard} className="feature-card">
                                    <img 
                                        src="/images/robot-dog.jpg" 
                                        alt="Discoveries" 
                                        style={styles.featureImage}
                                    />
                                    <p style={styles.featureText}>
                                        Findings of something previously unknown, whether in science, nature, or ideas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Team' && (
                        <div className="tab-panel active">
                            <h2 style={styles.title}>Our Team</h2>
                            <div style={styles.teamContainer}>
                                <div style={styles.teamMemberCard} className="team-member-card">
                                    <img 
                                        src="/images/lance.png" 
                                        alt="Lance Matthew Blanco" 
                                        style={styles.teamMemberImage}
                                    />
                                    <h3 style={styles.teamMemberName}>Lance Matthew Blanco</h3>
                                    <p style={styles.teamMemberPosition}>Frontend Developer</p>
                                </div>
                                <div style={styles.teamMemberCard} className="team-member-card">
                                    <img 
                                        src="/images/radiance.png" 
                                        alt="Radiance Esteban" 
                                        style={styles.teamMemberImage}
                                    />
                                    <h3 style={styles.teamMemberName}>Radiance Esteban</h3>
                                    <p style={styles.teamMemberPosition}>Project Manager/Web Designer</p>
                                </div>
                                <div style={styles.teamMemberCard} className="team-member-card">
                                    <img 
                                        src="/images/joseph.png" 
                                        alt="Joseph Ephraim Gulmatico" 
                                        style={styles.teamMemberImage}
                                    />
                                    <h3 style={styles.teamMemberName}>Joseph Ephraim Gulmatico</h3>
                                    <p style={styles.teamMemberPosition}>Backend Developer</p>
                                </div>
                                <div style={styles.lastRowWrapper}>
                                    <div style={styles.teamMemberCard} className="team-member-card">
                                        <img 
                                            src="/images/jan.png" 
                                            alt="Jan Grey Fuertes" 
                                            style={styles.teamMemberImage}
                                        />
                                        <h3 style={styles.teamMemberName}>Jan Grey Fuertes</h3>
                                        <p style={styles.teamMemberPosition}>Researcher</p>
                                    </div>
                                    <div style={styles.teamMemberCard} className="team-member-card">
                                        <img 
                                            src="/images/earl.png" 
                                            alt="Earl laurence Mandia" 
                                            style={styles.teamMemberImage}
                                        />
                                        <h3 style={styles.teamMemberName}>Earl laurence Mandia</h3>
                                        <p style={styles.teamMemberPosition}>Researcher</p>
                                    </div>
                                </div>
                            </div>
                            <style>
                                {`
                                    .team-member-card {
                                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                                    }
                                    
                                    .team-member-card:hover {
                                        transform: translateY(-5px);
                                        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                                    }
                                    
                                    .team-member-card img {
                                        transition: transform 0.3s ease;
                                    }
                                    
                                    .team-member-card:hover img {
                                        transform: scale(1.05);
                                    }
                                `}
                            </style>
                        </div>
                    )}
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
                    
                    .feature-card {
                        transition: all 0.3s ease;
                    }
                    
                    .feature-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    }
                    
                    .feature-card img {
                        transition: transform 0.3s ease;
                    }
                    
                    .feature-card:hover img {
                        transform: scale(1.05);
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
    title: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#007bff',
        marginBottom: '24px',
    },
    subtitle: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '16px',
        textAlign: 'center',
    },
    description: {
        maxWidth: '800px',
        margin: '0 auto 48px',
        textAlign: 'center',
    },
    text: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#666',
    },
    featuresContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
        margin: '48px 0',
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
    },
    featureImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    featureText: {
        padding: '20px',
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333',
        margin: 0,
    },
    teamContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '40px',
        margin: '48px auto',
        maxWidth: '1000px',
        padding: '0 20px',
        justifyItems: 'center',
    },
    lastRowWrapper: {
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        width: '100%',
    },
    teamMemberCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        width: '280px',
        height: '320px',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        }
    },
    teamMemberImage: {
        width: '200px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '16px',
        backgroundColor: '#f0f2f5',
    },
    teamMemberName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        margin: '8px 0 4px',
        padding: '0 10px',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    teamMemberPosition: {
        fontSize: '14px',
        color: '#666',
        margin: '0',
        padding: '0 10px',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export default AboutUsPage;

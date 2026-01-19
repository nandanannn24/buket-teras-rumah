import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';

const Header = ({ isAdmin, onLogout, onLogin }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (onLogin(username, password)) {
            setShowLogin(false);
            setUsername('');
            setPassword('');
        } else {
            alert('Login gagal! Username: admin, Password: admin123');
        }
    };

    return (
        <header className="header" style={styles.header}>
            <div className="container" style={styles.container}>
                <div style={styles.logoContainer}>
                    <img
                        src="/images/logo.webp"
                        alt="Teras Rumah Logo"
                        style={styles.logo}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%232e7d32'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' fill='white' text-anchor='middle'%3ETR%3C/text%3E%3C/svg%3E";
                        }}
                    />
                    <div>
                        <h1 style={styles.logoTitle}>Teras Rumah</h1>
                        <p style={styles.logoSubtitle}>Toko Buket Bunga</p>
                    </div>
                </div>

                <nav style={styles.nav}>
                    {isAdmin ? (
                        <>
                            <span style={styles.adminBadge}>Admin Mode</span>
                            <button
                                onClick={onLogout}
                                className="btn btn-danger"
                                style={styles.logoutBtn}
                            >
                                Logout Admin
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowLogin(true)}
                            className="btn btn-primary"
                            style={styles.loginBtn}
                        >
                            <FaUser /> Admin Login
                        </button>
                    )}
                </nav>
            </div>

            {showLogin && !isAdmin && (
                <div style={styles.loginModal}>
                    <div style={styles.loginContent}>
                        <h3 style={styles.loginTitle}>Admin Login</h3>
                        <form onSubmit={handleLoginSubmit}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                required
                            />
                            <div style={styles.loginButtons}>
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowLogin(false)}
                                    style={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <p style={styles.loginHint}>
                            Hint: Username: admin, Password: admin123
                        </p>
                    </div>
                </div>
            )}
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    logo: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid white',
    },
    logoTitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        margin: 0,
    },
    logoSubtitle: {
        fontSize: '0.9rem',
        opacity: 0.9,
        margin: 0,
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    adminBadge: {
        backgroundColor: '#ff9800',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    loginBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    logoutBtn: {
        padding: '8px 15px',
        fontSize: '0.9rem',
    },
    loginModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loginContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '400px',
    },
    loginTitle: {
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    loginButtons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: '#f5f5f5',
        color: '#333',
    },
    loginHint: {
        marginTop: '15px',
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
    },
};

export default Header;
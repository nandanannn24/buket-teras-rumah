import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';

const Header = ({ isAdmin, onLogout, onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(''); // Reset error
    
    if (onLogin(username, password)) {
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setLoginError('');
    } else {
      // GANTI: Pesan error tanpa menunjukkan username/password
      setLoginError('Password yang Anda masukkan salah');
      setPassword(''); // Kosongkan password field
    }
  };

  const handleCloseModal = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
    setLoginError('');
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
              <span className="admin-badge">Admin Mode</span>
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
            <div style={styles.loginHeader}>
              <h3 style={styles.loginTitle}>Admin Login</h3>
              <button 
                onClick={handleCloseModal}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
                  autoComplete="username"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                  autoComplete="current-password"
                />
              </div>
              
              {loginError && (
                <div style={styles.errorMessage}>
                  ⚠️ {loginError}
                </div>
              )}
              
              <div style={styles.loginButtons}>
                <button type="submit" className="btn btn-primary" style={styles.loginSubmitBtn}>
                  Login
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={handleCloseModal}
                  style={styles.cancelBtn}
                >
                  Batal
                </button>
              </div>
            </form>
            
            <div style={styles.loginFooter}>
              <p style={styles.loginNote}>
                Hanya untuk administrator toko
              </p>
            </div>
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
    zIndex: 2000,
    backdropFilter: 'blur(3px)',
  },
  loginContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  loginHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  loginTitle: {
    color: '#333',
    fontSize: '1.4rem',
    fontWeight: '600',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: '5px',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonHover: {
    backgroundColor: '#f5f5f5',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#2e7d32',
    boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    borderLeft: '4px solid #c62828',
  },
  loginButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
  },
  loginSubmitBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
  },
  loginFooter: {
    marginTop: '25px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  loginNote: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
  },
};

export default Header;

import React, { useState, useEffect } from 'react';
import FlowerGrid from '../components/FlowerGrid';

const Home = ({ flowers, onAddComment }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Sembunyikan welcome message setelah 3 detik
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="container" style={styles.container}>
      {/* Hero Section hanya muncul jika TIDAK ada bunga */}
      {flowers.length === 0 ? (
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Teras Rumah</h1>
            <p style={styles.heroSubtitle}>
              Toko buket bunga segar untuk setiap momen spesial Anda
            </p>
            <div style={styles.welcomeMessage}>
              <p>Silakan tunggu...</p>
              <div style={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </section>
      ) : showWelcome ? (
        // Welcome banner singkat saat pertama load
        <div style={styles.welcomeBanner}>
          <p>Selamat datang di <strong>Teras Rumah</strong>!</p>
        </div>
      ) : null}
      
      {/* Grid bunga langsung muncul */}
      <div style={styles.flowersSection}>
        {flowers.length > 0 ? (
          <>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>🌼 Koleksi Buket Bunga</h2>
              <p style={styles.sectionSubtitle}>
                {flowers.length} {flowers.length === 1 ? 'buket tersedia' : 'buket tersedia'}
              </p>
            </div>
            <FlowerGrid 
              flowers={flowers}
              isAdmin={false}
              onAddComment={onAddComment}
            />
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🌸</div>
            <h3 style={styles.emptyStateTitle}>Belum Ada Buket Tersedia</h3>
            <p style={styles.emptyStateText}>
              Admin sedang mempersiapkan koleksi bunga terbaik untuk Anda.
            </p>
            <p style={styles.emptyStateHint}>
              Silakan hubungi admin untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

const styles = {
  container: {
    paddingTop: '20px',
    paddingBottom: '50px',
    minHeight: 'calc(100vh - 100px)',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(46, 125, 50, 0.2)',
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '2.8rem',
    marginBottom: '15px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  welcomeMessage: {
    marginTop: '30px',
    fontSize: '1rem',
    opacity: 0.8,
  },
  loadingDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '10px',
  },
  loadingDotsSpan: {
    width: '10px',
    height: '10px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  welcomeBanner: {
    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '25px',
    textAlign: 'center',
    color: '#2e7d32',
    fontSize: '0.95rem',
    animation: 'fadeOut 3s forwards',
  },
  flowersSection: {
    padding: '10px 0',
  },
  sectionHeader: {
    marginBottom: '25px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    marginTop: '30px',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '15px',
  },
  emptyStateText: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto 10px',
  },
  emptyStateHint: {
    fontSize: '0.9rem',
    color: '#888',
    fontStyle: 'italic',
  },
};

// Tambahkan animasi ke CSS global
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
  .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
  .loading-dots span:nth-child(3) { animation-delay: 0; }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; display: none; }
  }
`, styleSheet.cssRules.length);

export default Home;

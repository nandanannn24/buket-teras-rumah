import React, { useState, useEffect } from 'react';
import FlowerGrid from '../components/FlowerGrid';
import './Home.css'; // File CSS terpisah

const Home = ({ flowers = [], onAddComment }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Sembunyikan welcome message setelah 3 detik
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Pastikan flowers adalah array
  const safeFlowers = Array.isArray(flowers) ? flowers : [];

  return (
    <main className="container" style={styles.container}>
      {/* Hero Section hanya muncul jika TIDAK ada bunga */}
      {safeFlowers.length === 0 ? (
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Teras Rumah</h1>
            <p className="hero-subtitle">
              Toko buket bunga segar untuk setiap momen spesial Anda
            </p>
            <div className="welcome-message">
              <p>Silakan tunggu...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </section>
      ) : showWelcome ? (
        // Welcome banner singkat saat pertama load
        <div className="welcome-banner">
          <p>Selamat datang di <strong>Teras Rumah</strong>!</p>
        </div>
      ) : null}
      
      {/* Grid bunga langsung muncul */}
      <div className="flowers-section">
        {safeFlowers.length > 0 ? (
          <>
            <div className="section-header">
              <h2 className="section-title">🌼 Koleksi Buket Bunga</h2>
              <p className="section-subtitle">
                {safeFlowers.length} {safeFlowers.length === 1 ? 'buket tersedia' : 'buket tersedia'}
              </p>
            </div>
            <FlowerGrid 
              flowers={safeFlowers}
              isAdmin={false}
              onAddComment={onAddComment}
            />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🌸</div>
            <h3 className="empty-state-title">Belum Ada Buket Tersedia</h3>
            <p className="empty-state-text">
              Admin sedang mempersiapkan koleksi bunga terbaik untuk Anda.
            </p>
            <p className="empty-state-hint">
              Silakan hubungi admin untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

// Hanya styles inline yang sederhana
const styles = {
  container: {
    paddingTop: '20px',
    paddingBottom: '50px',
    minHeight: 'calc(100vh - 100px)',
  }
};

export default Home;

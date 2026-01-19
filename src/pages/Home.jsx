import React from 'react';
import FlowerGrid from '../components/FlowerGrid';

const Home = ({ flowers, onAddRating, onAddComment }) => {
    return (
        <main className="container" style={styles.container}>
            <section style={styles.hero}>
                <h2 style={styles.heroTitle}>Buket Bunga Teras Rumah</h2>
                <p style={styles.heroSubtitle}>
                    Koleksi buket bunga indah untuk setiap momen spesial Anda
                </p>
            </section>

            <FlowerGrid
                flowers={flowers}
                isAdmin={false}
                onAddRating={onAddRating}
                onAddComment={onAddComment}
            />
        </main>
    );
};

const styles = {
    container: {
        paddingTop: '30px',
        paddingBottom: '50px',
    },
    hero: {
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px 20px',
        backgroundColor: '#e8f5e9',
        borderRadius: '10px',
    },
    heroTitle: {
        fontSize: '2.2rem',
        color: '#2e7d32',
        marginBottom: '10px',
    },
    heroSubtitle: {
        fontSize: '1.1rem',
        color: '#666',
        maxWidth: '600px',
        margin: '0 auto',
    },
};

export default Home;
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ flowerId, onAddRating }) => {
    const [hover, setHover] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const handleRating = (ratingValue) => {
        if (!hasRated) {
            onAddRating(flowerId, ratingValue);
            setHasRated(true);
            alert('Terima kasih atas rating Anda!');
        }
    };

    if (hasRated) {
        return (
            <div style={styles.ratedMessage}>
                <p>Terima kasih sudah memberikan rating!</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <p style={styles.label}>Berikan Rating:</p>
            <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        style={styles.starButton}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleRating(star)}
                    >
                        <FaStar
                            size={30}
                            color={star <= (hover) ? '#ffc107' : '#e4e5e9'}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '8px',
        color: '#666',
        fontSize: '0.9rem',
    },
    stars: {
        display: 'flex',
        gap: '5px',
    },
    starButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
    },
    ratedMessage: {
        padding: '10px',
        backgroundColor: '#e8f5e9',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#2e7d32',
    },
};

export default Rating;
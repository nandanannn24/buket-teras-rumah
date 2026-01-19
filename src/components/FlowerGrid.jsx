import React from 'react';
import FlowerCard from './FlowerCard';

const FlowerGrid = ({ flowers, isAdmin, onDelete, onAddRating, onAddComment }) => {
    if (flowers.length === 0) {
        return (
            <div style={styles.emptyState}>
                <h3>Tidak ada bunga tersedia</h3>
                {isAdmin && <p>Tambahkan bunga pertama Anda!</p>}
            </div>
        );
    }

    return (
        <div className="flower-grid">
            {flowers.map((flower) => (
                <FlowerCard
                    key={flower.id}
                    flower={flower}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                    onAddRating={onAddRating}
                    onAddComment={onAddComment}
                />
            ))}
        </div>
    );
};

const styles = {
    emptyState: {
        textAlign: 'center',
        padding: '50px 20px',
        color: '#666',
    },
};

export default FlowerGrid;
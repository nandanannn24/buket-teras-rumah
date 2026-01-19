import React, { useState } from 'react';
import { FaWhatsapp, FaTrash } from 'react-icons/fa';
import CommentSection from './CommentSection';

const FlowerCard = ({ flower, isAdmin, onDelete, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  
  const handleBuy = () => {
    const message = `Halo, saya ingin membeli ${flower.name} dengan harga Rp ${flower.price.toLocaleString()}.`;
    const phoneNumber = '6282228295920'; // Ganti dengan nomor toko
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={styles.card}>
      {isAdmin && (
        <button 
          onClick={() => onDelete(flower.id)}
          style={styles.deleteBtn}
          className="btn btn-danger"
        >
          <FaTrash />
        </button>
      )}
      
      <div style={styles.imageContainer}>
        {flower.image ? (
          <img 
            src={flower.image} 
            alt={flower.name} 
            style={styles.image}
          />
        ) : (
          <div style={styles.placeholderImage}>
            <span>Gambar Bunga</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.name}>{flower.name}</h3>
        <p style={styles.price}>Rp {flower.price.toLocaleString()}</p>
        <p style={styles.description}>{flower.description}</p>
        
        {!isAdmin && (
          <>
            <button 
              onClick={handleBuy}
              className="btn btn-whatsapp"
              style={styles.buyButton}
            >
              <FaWhatsapp /> Beli via WhatsApp
            </button>
            
            <div style={styles.interactionSection}>
              <button 
                onClick={() => setShowComments(!showComments)}
                style={styles.commentToggle}
              >
                {showComments ? 'Sembunyikan' : 'Lihat'} Komentar ({flower.comments?.length || 0})
              </button>
              
              {showComments && (
                <CommentSection 
                  flowerId={flower.id}
                  comments={flower.comments || []}
                  onAddComment={onAddComment}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
    deleteBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        padding: '8px',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
    },
    imageContainer: {
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '0.9rem',
    },
    content: {
        padding: '20px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    name: {
        fontSize: '1.2rem',
        marginBottom: '8px',
        color: '#333',
        fontWeight: '600',
    },
    price: {
        fontSize: '1.1rem',
        color: '#2e7d32',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    description: {
        color: '#666',
        marginBottom: '15px',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        flexGrow: 1,
    },
    ratingContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    },
    stars: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
    },
    ratingText: {
        fontSize: '0.85rem',
        color: '#666',
        marginLeft: '8px',
    },
    averageRating: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    buyButton: {
        width: '100%',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        fontSize: '0.9rem',
    },
    interactionSection: {
        borderTop: '1px solid #eee',
        paddingTop: '15px',
        marginTop: 'auto',
    },
    commentToggle: {
        background: 'none',
        border: 'none',
        color: '#2e7d32',
        cursor: 'pointer',
        fontSize: '0.85rem',
        marginTop: '10px',
        textDecoration: 'underline',
        padding: '5px 0',
        width: '100%',
        textAlign: 'left',
    },
};

export default FlowerCard;
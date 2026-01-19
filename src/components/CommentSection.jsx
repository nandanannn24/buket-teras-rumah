import React, { useState } from 'react';

const CommentSection = ({ flowerId, comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() && author.trim()) {
            const comment = {
                id: Date.now(),
                author: author.trim(),
                text: newComment.trim(),
                date: new Date().toLocaleDateString('id-ID'),
            };
            onAddComment(flowerId, comment);
            setNewComment('');
            setAuthor('');
        }
    };

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Komentar ({comments.length})</h4>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Nama Anda"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={styles.input}
                    required
                />
                <textarea
                    placeholder="Tulis komentar..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={styles.textarea}
                    rows="3"
                    required
                />
                <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                    Kirim Komentar
                </button>
            </form>

            <div style={styles.commentsList}>
                {comments.length === 0 ? (
                    <p style={styles.noComments}>Belum ada komentar. Jadilah yang pertama!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} style={styles.comment}>
                            <div style={styles.commentHeader}>
                                <strong style={styles.commentAuthor}>{comment.author}</strong>
                                <span style={styles.commentDate}>{comment.date}</span>
                            </div>
                            <p style={styles.commentText}>{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginTop: '15px',
    },
    title: {
        marginBottom: '15px',
        color: '#333',
        fontSize: '1.1rem',
    },
    form: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '0.9rem',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '0.9rem',
        resize: 'vertical',
    },
    submitBtn: {
        width: '100%',
    },
    commentsList: {
        maxHeight: '300px',
        overflowY: 'auto',
    },
    comment: {
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        marginBottom: '10px',
        borderLeft: '4px solid #2e7d32',
    },
    commentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    commentAuthor: {
        color: '#333',
        fontSize: '0.95rem',
    },
    commentDate: {
        color: '#666',
        fontSize: '0.85rem',
    },
    commentText: {
        color: '#555',
        fontSize: '0.9rem',
        lineHeight: '1.4',
    },
    noComments: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        padding: '20px',
    },
};

export default CommentSection;
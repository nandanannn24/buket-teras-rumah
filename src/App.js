import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch flowers from database
  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/.netlify/functions/flowers');
      setFlowers(response.data);
    } catch (error) {
      console.error('Error fetching flowers:', error);
      // Fallback jika API error
      const saved = localStorage.getItem('teras-rumah-flowers');
      if (saved) setFlowers(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const addFlower = async (flower) => {
    try {
      const response = await axios.post('/.netlify/functions/flowers', {
        ...flower,
        adminKey: 'admin123'
      });

      if (response.data.success) {
        fetchFlowers(); // Refresh list
        return { success: true, message: 'Bunga berhasil ditambahkan!' };
      }
    } catch (error) {
      console.error('Error adding flower:', error);
      // Fallback ke localStorage
      const newFlower = {
        ...flower,
        id: Date.now(),
        comments: []
      };
      const updatedFlowers = [newFlower, ...flowers];
      setFlowers(updatedFlowers);
      localStorage.setItem('teras-rumah-flowers', JSON.stringify(updatedFlowers));
      return { success: true, message: 'Bunga ditambahkan (offline mode)' };
    }
  };

  const deleteFlower = async (id) => {
    try {
      await axios.delete(`/.netlify/functions/flowers?id=${id}`, {
        data: { adminKey: 'admin123' }
      });
      fetchFlowers(); // Refresh list
      return { success: true, message: 'Bunga berhasil dihapus!' };
    } catch (error) {
      console.error('Error deleting flower:', error);
      // Fallback ke localStorage
      const updatedFlowers = flowers.filter(flower => flower.id !== id);
      setFlowers(updatedFlowers);
      localStorage.setItem('teras-rumah-flowers', JSON.stringify(updatedFlowers));
      return { success: true, message: 'Bunga dihapus (offline mode)' };
    }
  };

  const addComment = async (flowerId, comment) => {
    try {
      const response = await axios.post('/.netlify/functions/comments', {
        flowerId,
        author: comment.author,
        text: comment.text,
        date: comment.date
      });

      if (response.data.success) {
        // Update local state
        setFlowers(prevFlowers => 
          prevFlowers.map(flower => {
            if (flower.id === flowerId) {
              return {
                ...flower,
                comments: [response.data.comment, ...(flower.comments || [])]
              };
            }
            return flower;
          })
        );
        return { success: true, message: 'Komentar berhasil ditambahkan!' };
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Fallback
      setFlowers(prevFlowers => 
        prevFlowers.map(flower => {
          if (flower.id === flowerId) {
            return {
              ...flower,
              comments: [comment, ...(flower.comments || [])]
            };
          }
          return flower;
        })
      );
      return { success: true, message: 'Komentar ditambahkan (offline mode)' };
    }
  };

  return (
    <div className="App">
      <Header 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
        onLogin={handleLogin}
      />
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat bunga...</p>
        </div>
      ) : isAdmin ? (
        <Admin 
          flowers={flowers} 
          onAddFlower={addFlower} 
          onDeleteFlower={deleteFlower}
        />
      ) : (
        <Home 
          flowers={flowers} 
          onAddComment={addComment}
        />
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';

// Base URL untuk API
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions' 
  : 'http://localhost:8888/.netlify/functions';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch flowers dari database
  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/flowers`);
      setFlowers(response.data);
    } catch (error) {
      console.error('Error fetching flowers:', error);
      // Fallback ke localStorage jika API error
      const saved = localStorage.getItem('teras-rumah-flowers');
      if (saved) setFlowers(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  // GANTI: Username: rischa, Password: terasrumah123
  const handleLogin = (username, password) => {
    if (username === 'rischa' && password === 'terasrumah123') {
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
      const response = await axios.post(`${API_URL}/flowers`, {
        ...flower,
        adminKey: 'terasrumah123' // GANTI adminKey
      });

      if (response.data.success) {
        fetchFlowers();
        return { success: true, message: 'Bunga berhasil ditambahkan!' };
      }
      return { success: false, message: 'Gagal menambahkan bunga' };
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
      await axios.delete(`${API_URL}/flowers?id=${id}`, {
        data: { adminKey: 'terasrumah123' } // GANTI adminKey
      });
      fetchFlowers();
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
      const response = await axios.post(`${API_URL}/comments`, {
        flowerId,
        author: comment.author,
        text: comment.text,
        date: comment.date
      });

      if (response.data.success) {
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

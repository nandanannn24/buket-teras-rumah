import React, { useState } from 'react';
import FlowerGrid from '../components/FlowerGrid';

const Admin = ({ flowers = [], onAddFlower, onDeleteFlower }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nama bunga harus diisi');
      return;
    }
    if (!formData.description.trim()) {
      alert('Deskripsi harus diisi');
      return;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      alert('Harga harus diisi dengan angka positif');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await onAddFlower({
        ...formData,
        price: parseInt(formData.price)
      });
      
      if (result && result.success) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          image: ''
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error adding flower:', error);
      alert('Gagal menambahkan bunga. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pastikan flowers selalu array
  const safeFlowers = Array.isArray(flowers) ? flowers : [];
  const totalComments = safeFlowers.reduce((total, flower) => {
    return total + (Array.isArray(flower.comments) ? flower.comments.length : 0);
  }, 0);

  return (
    <main className="container" style={styles.container}>
      <h2 style={styles.title}>Panel Admin Teras Rumah</h2>
      
      <div style={styles.adminLayout}>
        <section style={styles.formSection}>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>➕ Tambah Bunga Baru</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Nama Bunga <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Contoh: Buket Mawar Merah"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Deskripsi <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Deskripsi detail tentang bunga..."
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Harga (Rp) <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  style={styles.input}
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 150000"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Gambar Bunga
                </label>
                <div style={styles.fileUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.fileInput}
                    id="flower-image"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="flower-image" style={styles.fileLabel}>
                    📷 {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                  </label>
                  <p style={styles.fileHint}>Format: JPG, PNG (Maks 2MB)</p>
                </div>
                {imagePreview && (
                  <div style={styles.imagePreview}>
                    <p style={styles.previewText}>Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={styles.previewImage}
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span style={styles.spinner}></span> Menyimpan...
                  </>
                ) : (
                  '💾 Simpan Bunga'
                )}
              </button>
            </form>
          </div>
          
          <div style={styles.statsCard}>
            <h4>📊 Statistik Toko</h4>
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{safeFlowers.length}</span>
                <span style={styles.statLabel}>Total Bunga</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{totalComments}</span>
                <span style={styles.statLabel}>Total Komentar</span>
              </div>
            </div>
          </div>
        </section>
        
        <section style={styles.flowersSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>
              🌸 Daftar Bunga ({safeFlowers.length})
            </h3>
            <p style={styles.sectionSubtitle}>
              {safeFlowers.length === 0 
                ? 'Belum ada bunga. Tambahkan bunga pertama Anda!' 
                : 'Bunga akan otomatis terlihat oleh pelanggan setelah ditambahkan'}
            </p>
          </div>
          
          <FlowerGrid 
            flowers={safeFlowers}
            isAdmin={true}
            onDelete={onDeleteFlower}
          />
        </section>
      </div>
    </main>
  );
};

// Styles tetap sama seperti sebelumnya
const styles = {
  container: {
    paddingTop: '30px',
    paddingBottom: '50px',
    minHeight: 'calc(100vh - 100px)',
  },
  title: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #2e7d32',
  },
  adminLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '30px',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  formTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  required: {
    color: '#f44336',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    transition: 'border-color 0.3s ease',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.3s ease',
  },
  fileUpload: {
    marginTop: '5px',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease',
  },
  fileHint: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '5px',
  },
  imagePreview: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px dashed #ddd',
  },
  previewText: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '8px',
  },
  previewImage: {
    width: '100%',
    maxHeight: '150px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  submitBtn: {
    padding: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #fff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  statsCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '15px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '5px',
  },
  flowersSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionHeader: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    color: '#333',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#666',
  },
};

// Tambahkan animasi spinner di CSS global
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Admin;

import React, { useState } from 'react';
import FlowerGrid from '../components/FlowerGrid';
import '../App.css';

const Admin = ({ flowers = [], onAddFlower, onDeleteFlower }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadError(''); // Reset error
    
    if (file) {
      // Validasi ukuran file (max 100MB = 100 * 1024 * 1024 bytes)
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (file.size > maxSize) {
        setUploadError('Ukuran gambar terlalu besar. Maksimal 100MB.');
        e.target.value = ''; // Reset input file
        setImagePreview(null);
        return;
      }

      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Format gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.');
        e.target.value = '';
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        setImagePreview(reader.result);
        setUploadError('');
      };
      
      reader.onerror = () => {
        setUploadError('Gagal membaca file gambar. Coba lagi.');
        e.target.value = '';
        setImagePreview(null);
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
    if (!formData.image) {
      alert('Gambar bunga harus diupload');
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
        setUploadError('');
        alert(result.message || 'Bunga berhasil ditambahkan!');
      }
    } catch (error) {
      console.error('Error adding flower:', error);
      alert('Gagal menambahkan bunga. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="form-group">
                <label className="form-label">
                  Nama Bunga <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: Buket Mawar Merah"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Deskripsi <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Deskripsi detail tentang bunga..."
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Harga (Rp) <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 150000"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Gambar Bunga <span style={styles.required}>*</span>
                </label>
                <div style={styles.fileUpload}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    style={styles.fileInput}
                    id="flower-image"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="flower-image" style={styles.fileLabel}>
                    📷 {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                  </label>
                  <p style={styles.fileHint}>
                    Format: JPG, PNG, WebP, GIF (Maksimal 100MB)
                  </p>
                </div>
                
                {uploadError && (
                  <div style={styles.errorBox}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <span style={styles.errorText}>{uploadError}</span>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="image-preview">
                    <div style={styles.previewHeader}>
                      <p style={styles.previewText}>Preview:</p>
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                          document.getElementById('flower-image').value = '';
                        }}
                        style={styles.removePreview}
                        disabled={isSubmitting}
                      >
                        Hapus
                      </button>
                    </div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="preview-image"
                    />
                    <p style={styles.fileSizeInfo}>
                      Ukuran file: {Math.round((formData.image.length * 3) / 4 / 1024 / 1024 * 100) / 100} MB
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={styles.submitBtn}
                disabled={isSubmitting || uploadError}
              >
                {isSubmitting ? (
                  <>
                    <span className="button-spinner"></span> Menyimpan...
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
          
          <div style={styles.adminNotes}>
            <h4>📝 Catatan Admin:</h4>
            <ul style={styles.notesList}>
              <li>Gambar maksimal 100MB. Format: JPG, PNG, WebP, GIF</li>
              <li>Gambar yang besar akan dikompresi otomatis oleh browser</li>
              <li>Disarankan ukuran gambar di bawah 5MB untuk performa terbaik</li>
              <li>Data disimpan di database cloud dan bisa diakses semua pengguna</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

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
    borderBottom: '2px solid var(--primary-green)',
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
  },
  required: {
    color: 'var(--danger-red)',
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
    transition: 'all 0.3s ease',
    border: '1px solid #ddd',
  },
  fileLabelHover: {
    backgroundColor: '#e0e0e0',
  },
  fileHint: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '5px',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: '10px 15px',
    borderRadius: '6px',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderLeft: '4px solid var(--danger-red)',
  },
  errorIcon: {
    fontSize: '1.2rem',
  },
  errorText: {
    color: '#c62828',
    fontSize: '0.9rem',
    flex: 1,
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  previewText: {
    fontSize: '0.9rem',
    color: '#666',
  },
  removePreview: {
    background: 'none',
    border: '1px solid #ddd',
    color: '#666',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
  },
  removePreviewHover: {
    backgroundColor: '#f5f5f5',
    borderColor: '#999',
  },
  fileSizeInfo: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '8px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  submitBtn: {
    padding: '12px',
    fontSize: '1rem',
    fontWeight: '600',
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
    color: 'var(--primary-green)',
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
  adminNotes: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid var(--primary-green)',
  },
  notesList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
  },
  notesListLi: {
    padding: '5px 0',
    fontSize: '0.9rem',
    color: '#555',
    display: 'flex',
    alignItems: 'flex-start',
  },
  notesListLiBefore: {
    content: '"•"',
    color: 'var(--primary-green)',
    fontWeight: 'bold',
    display: 'inline-block',
    width: '1em',
    marginRight: '10px',
  },
};

export default Admin;

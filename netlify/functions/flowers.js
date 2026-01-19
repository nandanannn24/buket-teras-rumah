// netlify/functions/flowers.js
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  // Izinkan akses dari semua domain (CORS)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Tangani preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Hubungkan ke database Neon
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    // 1. GET: Ambil semua data bunga + komentarnya
    if (event.httpMethod === 'GET') {
      const flowers = await sql`SELECT * FROM flowers ORDER BY created_at DESC`;
      
      // Ambil komentar untuk setiap bunga
      for (let flower of flowers) {
        const comments = await sql`
          SELECT * FROM comments 
          WHERE flower_id = ${flower.id} 
          ORDER BY created_at DESC
        `;
        flower.comments = comments;
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(flowers)
      };
    }

    // 2. POST: Hanya admin yang bisa tambah bunga
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      
      // Autentikasi admin SEDERHANA (password ada di body request)
      if (body.adminKey !== 'admin123') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Akses ditolak. Bukan admin.' })
        };
      }

      const { name, description, price, image } = body;
      
      // Masukkan data ke database
      const [newFlower] = await sql`
        INSERT INTO flowers (name, description, price, image)
        VALUES (${name}, ${description}, ${price}, ${image})
        RETURNING *
      `;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Bunga berhasil ditambahkan!',
          flower: newFlower 
        })
      };
    }

    // 3. DELETE: Hanya admin yang bisa hapus bunga
    if (event.httpMethod === 'DELETE') {
      const { id } = event.queryStringParameters;
      const body = JSON.parse(event.body);
      
      if (body.adminKey !== 'admin123') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Akses ditolak. Bukan admin.' })
        };
      }
      
      await sql`DELETE FROM flowers WHERE id = ${id}`;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Bunga dihapus.' })
      };
    }

    // Jika method tidak didukung
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method tidak diizinkan' })
    };

  } catch (error) {
    console.error('ERROR Database:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Gagal terhubung ke database',
        detail: error.message 
      })
    };
  }
};
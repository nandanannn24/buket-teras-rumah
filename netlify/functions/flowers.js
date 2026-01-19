const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    if (event.httpMethod === 'GET') {
      const flowers = await sql`SELECT * FROM flowers ORDER BY created_at DESC`;
      
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

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      
      // GANTI: Admin key baru
      if (body.adminKey !== 'terasrumah123') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Akses ditolak' })
        };
      }

      const { name, description, price, image } = body;
      
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

    if (event.httpMethod === 'DELETE') {
      const { id } = event.queryStringParameters;
      const body = JSON.parse(event.body);
      
      // GANTI: Admin key baru
      if (body.adminKey !== 'terasrumah123') {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Akses ditolak' })
        };
      }
      
      await sql`DELETE FROM flowers WHERE id = ${id}`;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Bunga dihapus' })
      };
    }

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

const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const sql = neon(process.env.NETLIFY_DATABASE_URL);
      const { flowerId, author, text, date } = JSON.parse(event.body);

      const result = await sql`
        INSERT INTO comments (flower_id, author, text, date)
        VALUES (${flowerId}, ${author}, ${text}, ${date})
        RETURNING *
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true, 
          comment: result[0] 
        })
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to add comment' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
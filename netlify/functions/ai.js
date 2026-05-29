// Netlify Function — proxy seguro para Gemini API
// A chave GEMINI_API_KEY fica guardada no servidor, nunca exposta ao browser.

exports.handler = async function(event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Serviço de IA não configurado. Contate o Rafael.' })
    };
  }

  // Proxy direto para Gemini — mesmo body, chave no servidor
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body
    }
  );

  const text = await response.text();

  return {
    statusCode: response.status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: text
  };
};

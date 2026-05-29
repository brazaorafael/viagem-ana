// Vercel Serverless Function — proxy seguro para Gemini API
// A chave GEMINI_KEY fica no servidor, nunca exposta ao browser.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Serviço de IA não configurado. Contate o Rafael.' });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    }
  );

  const data = await response.json();
  return res.status(response.status).json(data);
};

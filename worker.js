export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST' && request.url.endsWith('/chat')) {
      try {
        const { prompt } = await request.json();

        const CLOUDFLARE_ACCOUNT_ID = '08213166c7dfbe36381d0b2633b4050c'; // Your Account ID
        const CLOUDFLARE_API_TOKEN = 'rCleNftWKm0KmPWvscEMPJ-qPaY4R95uVMuErcYU'; // Your API Token
        const CLOUDFLARE_MODEL_NAME = '@cf/openai/gpt-oss-120b';

        const aiResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${CLOUDFLARE_MODEL_NAME}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ input: prompt })
        });

        const data = await aiResponse.json();

        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        };

        return new Response(JSON.stringify(data), { headers });

      } catch (error) {
        console.error('Worker error:', error);
        return new Response(JSON.stringify({ success: false, errors: [{ message: 'Worker server error.' }] }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    } else if (request.method === 'OPTIONS' && request.url.endsWith('/chat')) {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      };
      return new Response(null, { headers, status: 204 });
    }

    return new Response('Not Found', { status: 404 });
  },
};

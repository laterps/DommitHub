// netlify/functions/dispatch.js
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido, usa POST'
    };
  }

  let command;
  try {
    ({ command } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: 'JSON inválido'
    };
  }

  // Llama al workflow_dispatch de GitHub
  const ghRes = await fetch(
    'https://api.github.com/repos/laterps/DommitHub/actions/workflows/Dommithub.yml/dispatches',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Authorization': `token ${process.env.DOMMITHUB_TOKEN}`
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: { command }
      })
    }
  );

  const payload = await ghRes.text();
  return {
    statusCode: ghRes.status,
    body: payload
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body;
  if (typeof req.body === 'string') {
    body = req.body;
  } else {
    body = JSON.stringify(req.body);
  }

  const fieldMask = req.headers['x-goog-fieldmask'] || '';

  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchNearby',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask,
      },
      body,
    }
  );

  const data = await response.json();
  res.status(response.status).json(data);
}

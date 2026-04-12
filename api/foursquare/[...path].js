export default async function handler(req, res) {
  const fsqPath = `/${req.query.path.join('/')}`;

  // Build query string from only the real query params (exclude the catch-all "path")
  const { path, ...query } = req.query;
  const params = new URLSearchParams(query);
  const fsqUrl = `https://places-api.foursquare.com${fsqPath}?${params}`;

  const response = await fetch(fsqUrl, {
    headers: {
      Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`,
      Accept: 'application/json',
      'X-Places-Api-Version': '2025-06-17',
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}

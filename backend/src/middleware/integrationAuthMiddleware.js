const integrationAuth = (req, res, next) => {
  const configuredKey = process.env.NEWS_PLATFORM_API_KEY;

  if (!configuredKey) {
    return res.status(503).json({ message: 'News platform integration is not configured' });
  }

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;
  const apiKey = req.headers['x-api-key'];

  if (bearerToken === configuredKey || apiKey === configuredKey) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized integration request' });
};

module.exports = { integrationAuth };

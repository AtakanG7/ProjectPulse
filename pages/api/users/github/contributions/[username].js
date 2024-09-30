import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await axios.get(`https://github.com/users/${username}/contributions`, {
      headers: {
        'Accept': 'text/html',
      },
    });

    const $ = cheerio.load(response.data);
    const svgElement = $('svg.js-calendar-graph-svg');

    if (svgElement.length === 0) {
      throw new Error('SVG element not found');
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgElement.parent().html());
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub contributions' });
  }
}
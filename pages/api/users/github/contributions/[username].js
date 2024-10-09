import axios from 'axios';
import * as cheerio from 'cheerio';
import { authMiddleware, ownershipMiddleware, withErrorHandling } from '../../../middleware/authMiddleware';
export async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await axios.get(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    const contributionData = [];
    $('td.ContributionCalendar-day').each((_, element) => {
      const $element = $(element);
      const date = $element.attr('data-date');
      if (date) {
        contributionData.push({
          date,
          count: parseInt($element.attr('data-count'), 10) || 0,
          level: parseInt($element.attr('data-level'), 10) || 0
        });
      }
    });

    // Sort contributions by date and get the last year
    contributionData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const lastYearData = contributionData.slice(-365);

    // GitHub-style layout
    const weeks = 53; // Always show 53 weeks for consistency
    const svgWidth = weeks * 13 + 15; // 13px per column + 15px left margin
    const svgHeight = 7 * 13 + 30; // 7 rows * 13px + 30px top margin for month labels
    const cellSize = 10;

    let svg = `
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .contribution { shape-rendering: geometricPrecision; }
          .month-label { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 9px; fill: #7e7e7e; }
          .day-label { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 9px; fill: #7e7e7e; }
        </style>
    `;

    // Add month labels diagonally
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;
    lastYearData.forEach((day, index) => {
      const date = new Date(day.date);
      const month = date.getMonth();
      const week = Math.floor(index / 7);
      if (month !== lastMonth) {
        const x = week * 13 + 15; // Adjust x position
        const monthName = months[month];
        svg += `
          <text 
            x="${x}" 
            y="10" 
            class="month-label" 
            transform="rotate(-45, ${x}, 10)"
            text-anchor="start"
            dominant-baseline="hanging"
          >${monthName}</text>
        `;
        lastMonth = month;
      }
    });

    // Add day labels
    const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    days.forEach((day, index) => {
      if (day) {
        svg += `<text x="0" y="${index * 13 + 35}" class="day-label" text-anchor="start">${day}</text>`;
      }
    });

    // Fill in the contributions
    lastYearData.forEach((day, index) => {
      const week = Math.floor(index / 7);
      const dayOfWeek = index % 7;
      const x = week * 13 + 15; // 15px left margin
      const y = dayOfWeek * 13 + 20; // 20px top margin
      const color = getColor(day.level);
      svg += `
        <rect 
          x="${x}" y="${y}" 
          width="${cellSize}" height="${cellSize}" 
          fill="${color}" 
          class="contribution"
          rx="2" ry="2"
        >
          <title>${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}</title>
        </rect>
      `;
    });

    svg += '</svg>';

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub contributions', details: error.message });
  }
}

export default withErrorHandling(handler);

function getColor(level) {
  // GitHub color levels for contributions (2024 color scheme)
  const colors = ['#ebedf0', '#39d353', '#26a641', '#006d32', '#0e4429'];
  return colors[level] || colors[0];
}
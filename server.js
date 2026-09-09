const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const DB_GAMES_PATH = path.join(BASE_DIR, 'db', 'games.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function getGamesData() {
  try {
    if (fs.existsSync(DB_GAMES_PATH)) {
      return JSON.parse(fs.readFileSync(DB_GAMES_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading games db:', e);
  }
  return [];
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let urlPath = decodeURIComponent(parsedUrl.pathname);

  // Set CORS headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API REST ENDPOINTS ---
  if (urlPath === '/api/games' || urlPath === '/api/games/') {
    const platform = parsedUrl.searchParams.get('platform');
    const genre = parsedUrl.searchParams.get('genre');
    const search = parsedUrl.searchParams.get('q');
    
    let games = getGamesData();
    if (platform) {
      games = games.filter(g => g.platforms && g.platforms.includes(platform.toLowerCase()));
    }
    if (genre) {
      games = games.filter(g => g.genre && g.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      games = games.filter(g => g.title.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q)));
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, count: games.length, data: games }, null, 2));
    return;
  }

  if (urlPath.startsWith('/api/games/')) {
    const gameId = urlPath.replace('/api/games/', '').trim();
    const games = getGamesData();
    const found = games.find(g => g.id === gameId);
    if (found) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, data: found }, null, 2));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: 'Game not found' }, null, 2));
    }
    return;
  }

  if (urlPath === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString(), dbItems: getGamesData().length }));
    return;
  }

  // Route aliases
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/home/home.html';
  } else if (urlPath === '/home' || urlPath === '/home/') {
    urlPath = '/home/home.html';
  } else if (urlPath === '/consoles/ps5' || urlPath === '/consoles/ps5/') {
    urlPath = '/consoles/ps5/ps5.html';
  } else if (urlPath === '/consoles/ps4' || urlPath === '/consoles/ps4/') {
    urlPath = '/consoles/ps4/ps4.html';
  } else if (urlPath === '/consoles/ps3' || urlPath === '/consoles/ps3/') {
    urlPath = '/consoles/ps3/ps3.html';
  } else if (urlPath === '/consoles/xbox' || urlPath === '/consoles/xbox/') {
    urlPath = '/consoles/xbox/xbox.html';
  } else if (urlPath === '/disk' || urlPath === '/disk/') {
    urlPath = '/disk/disk.html';
  } else if (urlPath === '/discs-only' || urlPath === '/discs-only/') {
    urlPath = '/discs-only/discs-only.html';
  } else if (urlPath === '/pc-games' || urlPath === '/pc-games/') {
    urlPath = '/pc-games/pc-games.html';
  } else if (urlPath === '/accessories' || urlPath === '/accessories/') {
    urlPath = '/accessories/accessories.html';
  } else if (urlPath === '/wraps' || urlPath === '/wraps/') {
    urlPath = '/wraps/wraps.html';
  } else if (urlPath === '/request-form' || urlPath === '/request-form/') {
    urlPath = '/request-form/request-form.html';
  } else if (urlPath === '/cart' || urlPath === '/cart/') {
    urlPath = '/cart/cart.html';
  } else if (urlPath === '/order-tracking' || urlPath === '/order-tracking/') {
    urlPath = '/order-tracking/order-tracking.html';
  } else if (urlPath === '/how-it-works' || urlPath === '/how-it-works/') {
    urlPath = '/how-it-works/how-it-works.html';
  } else if (urlPath === '/faq' || urlPath === '/faq/') {
    urlPath = '/faq/faq.html';
  } else if (urlPath === '/price-list' || urlPath === '/price-list/') {
    urlPath = '/price-list/price-list.html';
  }

  let filePath = path.join(BASE_DIR, urlPath);

  // Check if file exists, or if adding .html helps
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif; background:#080a0f; color:#fff; padding:40px; text-align:center;"><h2>404 Page Not Found</h2><p style="color:#94a3b8;">Requested: ${urlPath}</p><a href="/home/home.html" style="color:#39ff14; font-weight:bold; text-decoration:none; display:inline-block; margin-top:20px; padding:10px 20px; background:#131926; border-radius:8px;">← Go to Legend Games Home</a></body></html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(` LEGEND GAMES DATABASE & SERVER IS LIVE!`);
  console.log(`======================================================`);
  console.log(` Web App:   http://localhost:${PORT}`);
  console.log(` Games API: http://localhost:${PORT}/api/games`);
  console.log(`======================================================\n`);
});

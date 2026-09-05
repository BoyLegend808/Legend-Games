const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

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

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  
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
  console.log(` LEGEND GAMES LOCALHOST SERVER IS LIVE!`);
  console.log(`======================================================`);
  console.log(` http://localhost:${PORT}`);
  console.log(` http://127.0.0.1:${PORT}`);
  console.log(`======================================================\n`);
});

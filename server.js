const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    let data = '';
    try {
      switch (pathname) {
        case '/api/git':
          data = execSync('git status --short', { encoding: 'utf8' }).trim();
          break;
        case '/api/memory':
          data = execSync('ls memory/*.md 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
          break;
        case '/api/nodes':
          data = execSync('nodes status --compact', { encoding: 'utf8' }).trim();
          break;
        case '/api/commits':
          data = execSync('git log --oneline -5 || echo "No commits"', { encoding: 'utf8' }).trim();
          break;
        case '/api/heartbeat':
          data = execSync('tail -10 HEARTBEAT.md || echo "No HEARTBEAT.md"', { encoding: 'utf8' }).trim();
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ data }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    // Serve static files
    let filePath = pathname === '/' ? 'dashboard.html' : pathname.slice(1);
    try {
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      const content = fs.readFileSync(filePath, 'utf8');
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
      };
      const contentType = (mimeTypes[ext] || 'text/plain') + '; charset=utf-8';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end('Server error');
    }
  }
});

server.listen(3000, 'localhost', () => {
  console.log('Fox Den Dashboard server running on http://localhost:3000');
});
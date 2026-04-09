import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal
  if (!path.resolve(filePath).startsWith(path.resolve(__dirname))) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
    return;
  }

  const ext = path.extname(filePath);
  let contentType = 'text/plain';

  if (ext === '.html') contentType = 'text/html';
  else if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js' || ext === '.mjs') contentType = 'application/javascript';
  else if (ext === '.json') contentType = 'application/json';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.svg') contentType = 'image/svg+xml';
  else if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.woff' || ext === '.woff2') contentType = 'font/woff2';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${__dirname}`);
  console.log(`\n✨ Wedding Edit House landing page is live!\n`);
});

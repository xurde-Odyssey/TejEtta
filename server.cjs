const { createServer } = require('node:http');
const next = require('next');

// CloudLinux/Passenger starts this file from the hosting control panel.
process.chdir(__dirname);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();
const port = Number(process.env.PORT || 3000);

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res).catch((error) => {
      console.error('Request failed:', error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal server error');
      } else {
        res.destroy();
      }
    });
  });
  server.on('error', (error) => {
    console.error('Server failed:', error);
    process.exit(1);
  });
  server.listen(port);
}).catch((error) => {
  console.error('Next.js startup failed:', error);
  process.exit(1);
});

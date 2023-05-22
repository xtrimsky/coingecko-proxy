const http = require('http');
const httpProxy = require('http-proxy');

// Create a new HTTP proxy server
const proxy = httpProxy.createProxyServer();

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Check if the 'apikey' header exists and has the correct value
  if (req.headers.apikey !== 'AN_API_KEY') {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }

  // Proxy the request to the CoinGecko API
  proxy.web(req, res, {
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    prependPath: '/api/v3',
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});


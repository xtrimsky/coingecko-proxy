const http = require('http');
const axios = require('axios');
const express = require('express');

const app = express();

// Define a route for the proxy
app.all('*', async (req, res) => {
  // Check if the 'apikey' header exists and has the correct value
  if (req.headers.apikey !== 'AN_API_KEY') {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const targetUrl = 'http://api.coingecko.com/api/v3' + req.originalUrl;
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Host': 'api.coingecko.com',
        'Referer': 'http://api.coingecko.com',
      },
      data: req.body,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// Start the server on port 3000
http.createServer(app).listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});

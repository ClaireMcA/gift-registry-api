const express = require('express');
const http = require('http');
const https = require('https');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
var fs = require('fs');

const root = './';
const port = 3000;
const sslPort = 4000;
const app = express();
const cert = fs.readFileSync(`${(process.env.CERT_PATH || 'certs')}/fullchain.pem`);
const key = fs.readFileSync(`${(process.env.CERT_PATH || 'certs')}/privkey.pem`);
corsUris = [ "http://localhost:4200", "https://" + process.env.DOMAIN, "http://" + process.env.DOMAIN ]

app.enable('trust proxy');
app.use(function(request, response, next) {
    if (process.env.NODE_ENV == 'production' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
});
app.use(cors({ origin: corsUris }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);

app.use(express.static(path.join(root, 'dist/')));
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', {root});
});

// Error handler
app.use((err, req, res, next) => {
  console.log('Error handler', err);
  res.status(err.status || 500);
  res.send(err);
});

require('./mongo');

const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key, cert }, app);
httpServer.listen(port, () => console.log(`HTTP API running on port:${port}`));
httpsServer.listen(sslPort, () => console.log(`HTTPS API running on port:${sslPort}`));
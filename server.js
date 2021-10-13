const express = require('express');
const http = require('http');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const root = './';
const port = (process.env.PORT || 3000);
const app = express();
corsUris = [ "http://localhost:4200", "https://34.87.247.187", "http://34.87.247.187" ]

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

const server = http.Server(app);
server.listen(port, () => console.log(`API running on port:${port}`));
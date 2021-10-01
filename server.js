const express = require('express');
const http = require('http');
const routes = require('./routes');
const cors = require('cors');

const port = (process.env.PORT || 3000);
const app = express();
corsUris = [ "http://localhost:4200", "https://mainly-music-ui.herokuapp.com", "http://mainly-music-ui.herokuapp.com" ]

app.use(cors({ origin: corsUris }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);

require('./mongo');

const server = http.Server(app);
server.listen(port, () => console.log(`API running on port:${port}`));
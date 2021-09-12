const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const routes = require('./routes');
const cors = require('cors');

const port = (process.env.PORT || 3000);
const app = express();
corsUris = [ "http://localhost:4200", "https://mainly-music-ui.herokuapp.com", "http://mainly-music-ui.herokuapp.com" ]

app.use(cors({ origin: corsUris }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

require('./mongo');

const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server, {
    cors: {
        origin: corsUris
    }
});

io.on('connection', (socket) => {
    socket.on('sessionupdated', (session) => {
        io.emit('sessionupdated', session)
    });

    socket.on('personupdated', (person) => {
        io.emit('personupdated', person)
    });
    
    socket.on('personscreated', (persons) => {
        io.emit('personscreated', persons);
    });
});

server.listen(port, () => console.log(`API running on localhost:${port}`));
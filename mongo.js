const { MongoClient } = require('mongodb');
const environment = require('./env/environment');

const mongoUri = process.env.MONGODB_URI || environment.connectionString;

MongoClient.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, { promiseLibrary: Promise }, function (err, db) {
    if (err) throw err;
    global.dbo = db.db('gift-registry');
});  

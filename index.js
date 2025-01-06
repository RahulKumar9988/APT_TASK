const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const eventRoutes = require('./routes/event'); // Import event routes

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = 'mongodb://localhost:27017/';
const dbName = 'eventDB';
let db;

// Connect to MongoDB
MongoClient.connect(url)
    .then((client) => {
        db = client.db(dbName);
        console.log('Connected to Database');
    })
    .catch((err) => console.error(err));

// Pass the database instance to all requests
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Event API');
});

// Use event routes
app.use('/api/v3/app', eventRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

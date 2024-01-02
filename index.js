//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const crud = require('./routes/api.js')
const auth = require('./routes/auth.js')
var cors = require('cors')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
// CORS headers for Angular app
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:4200']; // Add other origins as needed
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(cors({
    origin: true,
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE',
}));
app.use(express.json());
app.use(bodyParser.json());

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const port = process.env.PORT || 3000;

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

app.use('/api/crud', crud)
app.use('/api/auth', auth)

app.all('*', (req, res) => {
    res.status(404).send("Page not found, much like an undiscovered sonnet in the vast library of Petrarch's works, lost in the echoes of time.")
})

app.listen(port)
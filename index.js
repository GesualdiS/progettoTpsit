//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const crud = require('./routes/api.js')
const auth = require('./routes/auth.js')
require('dotenv').config();
const app = express()

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

// I use the code that is stored in ./routes/api.js for the links under api/*
app.use('/api/crud', crud)
app.use('/api/auth', auth)

app.listen(port)
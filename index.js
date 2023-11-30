const express = require('express');
const app = express();
const dbRouter = require("./routes/user.js")

app.use('/api', dbRouter)

// Definisci le route per le pagine
app.get('/', (req, res) => {
    res.sendFile('login.html', {root: __dirname + '/public'});
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', {root: __dirname + '/public'});
});

app.get('/signup', (req, res) => {
    res.sendFile('login.html', {root: __dirname + '/public'});
});

app.get('/erroreLogin', (req, res) => {
    res.sendFile('loginErrato.html', {root: __dirname + '/public'});
});

app.get('/erroreSignup', (req, res) => {
    res.sendFile('SignupErrato.html', {root: __dirname + '/public'});
});

app.get('/style.css', (req, res) => {
    res.sendFile('style.css', {root: __dirname + '/public'});
});

app.get('/script.js', (req, res) => {
    res.sendFile('script.js', {root: __dirname + '/public'});
});

app.all('*', (req, res) => {
    res.sendFile('error404.html', {root: __dirname + '/public'});
})

app.listen(3000);


//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const mysql = require('mysql2')
const router = express.Router()
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getTokens = require('../jwt');
const refreshAccessToken = require('../jwt');



//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const serverHost = process.env.SERVER_HOST;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_DATABASE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


//   +--------------------------------+
//   |   We connect to the database   |
//   +--------------------------------+

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.get('/verifyEmail/:token', (req, res) => {
    const { token } = req.params;

    db.query(`SELECT id_user, id_verify_link FROM Verify_links WHERE token = ?;`, [token], (err, selectResults, fields) => {
        if (err || selectResults.length === 0) {
            console.error('Error during the query:', err);
            return res.status(500).send('Internal Server Error');
        }

        const userId = selectResults[0].id_user;

        db.query(`UPDATE Users SET has_verified = ? WHERE id_user = ?;`, [1, userId], (err, updateResults, fields) => {
            if (err) {
                console.error('Error during the query:', err);
                return res.status(500).json({ result: 'Internal Server Error' });
            }

            db.query(`DELETE FROM Verify_links WHERE token = ?;`, [token], (err, deleteResults, fields) => {
                if (err) {
                    console.error('Error during the query:', err);
                }
                const tokens = getTokens(userId)
                if (tokens)
                    res.status(200).json({ result: 'User verified', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
                else
                    res.status(500).send('Internal Server Error')
            });
        });
    });
});


router.post('/login', (req, res) => {   
    const {email, password} = req.body
    try {
        db.query(`SELECT password, has_verified FROM Users WHERE email = ?;`, [email], async (err, results, fields) => {
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results[0].password)){
                if(results[0].has_verified) {
                    const token = jwt.sign({ id: results[0].id }, apiKey, { expiresIn: '1h' });
                    return res.status(200).json({result: 'User logged in', user: results[0], token});
                } else {
                    res.status(400).json({result: 'User not verified'});
                }
            }else {
                res.status(400).json({result: 'Wrong credentials'});            
            }
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }      
})

module.exports = router
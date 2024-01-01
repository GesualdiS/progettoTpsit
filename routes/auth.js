//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const db = require('../database.js')
const router = express.Router()
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getTokens = require('../jwt');
const refreshAccessToken = require('../jwt');

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.get('/verifyEmail/:token', (req, res) => {
    const { token } = req.params;

    db.query(`SELECT id_user, id_verify_link FROM Verify_links WHERE token = $1;`, [token], (err, results, fields) => {
        if (err || results.rowCount === 0) {
            console.error('Error during the query:', err);
            return res.status(500).send('Internal Server Error');
        }

        const userId = results.rows[0].id_user;

        db.query(`UPDATE Users SET has_verified = true WHERE id_user = $1;`, [userId], (err, results, fields) => {
            if (err) {
                console.error('Error during the query:', err);
                return res.status(500).json({ result: 'Internal Server Error' });
            }

            db.query(`DELETE FROM Verify_links WHERE token = $1;`, [token], (err, results, fields) => {
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

// for now the login work only with credentials, but I want to log even with the token
router.post('/login', (req, res) => {   
    const {email, password} = req.body
    try {
        db.query(`SELECT password, has_verified FROM Users WHERE email = ?;`, [email], async (err, results, fields) => {
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results[0].password)){
                if(results[0].has_verified) {
                    const tokens = getTokens(userId)
                    if (tokens)
                        res.status(200).json({ result: 'User verified', accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
                    else
                        res.status(500).send('Internal Server Error')
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
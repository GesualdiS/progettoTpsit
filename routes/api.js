//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const mysql = require('mysql2')
const router = express.Router()
const bodyParser = require('body-parser');
const e = require('express');
const {cryptPassword} = require(__dirname + '/../crypt')
require('dotenv').config();
const bcrypt = require('bcrypt');
router.use(bodyParser.json());

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbNome = process.env.DB_DATABASE;
const apiKey = process.env.API_KEY;

//   +--------------------------------+
//   |   We connect to the database   |
//   +--------------------------------+

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbNome
});

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.post('/createUser', async (req, res) => {
    const { email, password, username } = req.body;
    if(!email || !password || !username)
        res.status(400).json({result: 'Error due the unreiceved data'});
    try {
        const hashedPassword = await cryptPassword(password)
        db.query(`INSERT INTO Users(email, password, username) VALUES(?, ?, ?);`, [email, hashedPassword, username], (err, results, fields) => {
            if (err) {
                console.error('Error during the query:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log(`insert user id: ${results.insertId}`);
            res.status(200).json({result: 'User created successfully'});
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }
});

// For now a user can change password only knowning the current
router.put('/updateUserPassword', async (req, res) => {
    const {email, oldPassword, newPassword} = req.body
    try {
        db.query(`SELECT password FROM Users WHERE email = ?;`, [email], async (err, results, fields) => {
            if (err) {
                console.error('Error during the query:', err);
                return res.status(500).send('Internal Server Error');
            }else if(results.affectedRows == 1 || await bcrypt.compare(oldPassword, results[0].password)){
                db.query(`UPDATE Users SET password = ? WHERE email = ?;`, [await cryptPassword(newPassword), email], (err, results, fields) => {
                    if(results.affectedRows !== 1) res.status(400).json({result: 'Email or password wrong'});
                    else if(err){
                        res.status(500).json({result: 'Internal Server Error'});
                        console.log('Error during the query')
                    } 
                    else res.status(200).json({result: 'User updated'});
                })
            }else
                res.status(400).json({result: 'Wrong credentials'});            
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }
    
})

router.put('/updateUserEmail', (req, res) => {
    const {oldEmail, newEmail, password} = req.body
    db.query(`UPDATE Users SET email = ? WHERE email = ? AND password = ?;`, [newEmail, oldEmail, password], (err, results, fields) => {
        if(results.affectedRows !== 1) console.log(`Email or password wrong`)
        else if(err) console.log('Error during the query')
        else console.log(`User updated`)
    })
})

router.delete('/deleteUser', (req, res) => {   
    const {email, password} = req.body
    db.query(`DELETE FROM Users WHERE email = ? AND password = ?;`, [email, password], (err, results, fields) => {
        if(results.affectedRows !== 1) console.log(`User not found`)
        else if(err) console.log('Error during the query')
        else console.log(`User removed`)
    })
})

module.exports = router
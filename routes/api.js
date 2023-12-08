//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const mysql = require('mysql2')
const router = express.Router()
const bodyParser = require('body-parser');
const {cryptPassword} = require(__dirname + '/../crypt')
require('dotenv').config();
const bcrypt = require('bcrypt');
const sendVerificationEmail = require('../mail');
router.use(bodyParser.json());


//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const serverHost = process.env.SERVER_HOST;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_DATABASE;
const apiKey = process.env.API_KEY;

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
            sendVerificationEmail(email, results.insertId)
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
            //you'll get error during the query if the email wasn't in the db
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(oldPassword, results[0].password)){
                db.query(`UPDATE Users SET password = ? WHERE email = ?;`, [await cryptPassword(newPassword), email], (err, results, fields) => {
                    if(results.affectedRows !== 1) res.status(400).json({result: 'Email or password wrong'});
                    else if(err){
                        res.status(500).json({result: 'Internal Server Error'});
                        console.log('Error during the query')
                    } 
                    else res.status(200).json({result: 'User password updated'});
                })
            }else
                res.status(400).json({result: 'Wrong credentials'});            
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }
    
})

router.put('/updateUserEmail', async (req, res) => {
    const {oldEmail, newEmail, password} = req.body
    try {
        db.query(`SELECT password FROM Users WHERE email = ?;`, [oldEmail], async (err, results, fields) => {
            //you'll get error during the query if the email wasn't in the db
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results[0].password)){
                db.query(`UPDATE Users SET email = ? WHERE email = ?;`, [newEmail, oldEmail], (err, results, fields) => {
                    if(results.affectedRows !== 1) res.status(400).json({result: 'Email or password wrong'});
                    else if(err){
                        res.status(500).json({result: 'Internal Server Error'});
                        console.log('Error during the query')
                    } 
                    else res.status(200).json({result: 'User email updated'});
                })
            }else
                res.status(400).json({result: 'Wrong credentials'});            
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }   
})

router.delete('/deleteUser', (req, res) => {   
    const {email, password} = req.body
    try {
        db.query(`SELECT password FROM Users WHERE email = ?;`, [email], async (err, results, fields) => {
            //you'll get error during the query if the email wasn't in the db
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results[0].password)){
                db.query(`DELETE FROM Users WHERE email = ?;`, [email], (err, results, fields) => {
                    if(err){
                        console.log('Error during the query')
                        res.status(500).json({result: 'Internal Server Error'});
                    } 
                    else{
                        console.log(`User removed`)
                        res.status(200).send('User removed');
                    } 
                })
            }else
                res.status(400).json({result: 'Wrong credentials'});            
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({result: 'Internal Server Error'});
    }      
})

module.exports = router
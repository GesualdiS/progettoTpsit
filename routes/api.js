//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const router = express.Router()
const {cryptPassword} = require('../crypt')
require('dotenv').config();
const bcrypt = require('bcrypt');
const sendVerificationEmail = require('../mail');
const db = require('./../database.js')

//   +--------------------------------------------------+
//   |   I start to write the code for the web server   |
//   +--------------------------------------------------+

router.post('/createUser', async (req, res) => {
    console.log(req.body)
    const { email, password, username } = req.body;
    if(!email || !password || !username || email == '' || username == '' || password == '')
        return res.status(400).json({result: 'Error due the unreiceved data'});
    try {
        const hashedPassword = await cryptPassword(password)
        db.query(`INSERT INTO Users(email, password, username) VALUES($1, $2, $3);`, [email, hashedPassword, username], (err, results, fields) => {
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
        db.query(`SELECT password FROM Users WHERE email = $1;`, [email], async (err, results, fields) => {
            //you'll get error during the query if the email wasn't in the db
            if (err || results.rowCount === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(oldPassword, results.rows[0].password)){
                db.query(`UPDATE Users SET password = $1 WHERE email = $2;`, [await cryptPassword(newPassword), email], (err, results, fields) => {
                    if(err){
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
        db.query(`SELECT password FROM Users WHERE email = $1;`, [oldEmail], async (err, results, fields) => {
            //you'll get error during the query if the email wasn't in the db
            if (err || results.rowCount === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results.rows[0].password)){
                db.query(`UPDATE Users SET email = $1, has_verified = false WHERE email = $2;`, [newEmail, oldEmail], (err, results, fields) => {
                    if(err){
                        res.status(500).json({result: 'Internal Server Error'});
                        console.log('Error during the query: ' + err)
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
        db.query(`SELECT password FROM Users WHERE email = $1;`, [email], async (err, results, fields) => {
            //you'll get error during the query if the email wasn't in the db
            if (err || results.length === 0) {
                console.error('Error during the query:', err);
                res.status(500).send('Internal Server Error');
            }else if(await bcrypt.compare(password, results.rows[0].password)){
                db.query(`DELETE FROM Users WHERE email = $1;`, [email], (err, results, fields) => {
                    if(err){
                        console.log('Error during the query')
                        res.status(500).json({result: 'Internal Server Error'});
                    } 
                    else{
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
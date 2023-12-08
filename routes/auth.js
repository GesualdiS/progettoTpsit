//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const express = require('express')
const mysql = require('mysql2')
const router = express.Router()
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');
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

router.get('/verifyEmail/:token', (req, res) => {
    const {token} = req.params
    console.log(token)
    db.query(`SELECT id_user, id_verify_link FROM Verify_links WHERE token = ?;`, [token], (err, results, fields) => {
        //you'll get error during the query if the token wasn't in the db
        if (err || results.length === 0) {
            console.log(results.length)
            console.error('Error during the query:', err);
            res.status(500).send('Internal Server Error');
        }else{
            db.query(`UPDATE Users SET has_verified = ? WHERE id_user = ?;`, [1, results[0].id_user], (err, results, fields) => {
                if(err){
                    res.status(500).json({result: 'Internal Server Error'});
                    console.log('Error during the query')
                } 
                else{
                    db.query(`DELETE FROM Verify_links WHERE token = ?;`, [token], (err, results, fields) => {
                       //here we had delete the row that contained that token 
                    })
                    res.status(200).json({result: 'User has verified'});
                } 
            })
        }
    });

});

router.all('*', (req, res) => {
    console.log('here')

});

module.exports = router
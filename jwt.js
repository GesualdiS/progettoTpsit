//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const { v4: uuidv4 } = require('uuid') // It generate unique string
const db = require('./database.js')
require('dotenv').config();
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

//   +---------------------------------------------------------+
//   |   We define the functions that we are going to export   |
//   +---------------------------------------------------------+

//this function return null in case of some errors
function getTokens(id_user){
    const accessToken = jwt.sign({id_user: id_user}, accessTokenSecret, {expiresIn: '30m'})
    const refreshToken = jwt.sign({id_user: id_user}, refreshTokenSecret)
    db.query(`INSERT INTO User_tokens(id_user, refresh_token) VALUES ($1, $2);`, [id_user, refreshToken], (err, results, fields) => {
        if (err) {
            console.error('Error during the query:', err);
            return null;
        }
        console.log(`insert refreshToken id: ${results.insertId}`);
    });
    return {accessToken: accessToken, refreshToken: refreshToken}
}

function refreshAccessToken(refreshToken){
    const id_user = null;
    db.query(`SELECT id_user FROM User_token WHERE refresh_token = $1;`, [refreshToken], (err, results, fields) => {
        if (err) {
            console.error('Error during the query:', err);
            return res.status(500).send('Internal Server Error');
        }else if(results.length === 0 ){
            return res.status(403).send('Token was wrong');
        }
        jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            id_user = user.id_user
        })
    });
    return {"accessToken": jwt.sign({id_user: user.id_user}, accessTokenSecret, {expiresIn: '30m'})}
}

module.exports = getTokens, refreshAccessToken

//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid') // It generate unique string
const mysql = require('mysql2')
require('dotenv').config();

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const port = process.env.PORT;
const serverHost = process.env.SERVER_HOST;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_DATABASE;
const apiKey = process.env.API_KEY;
const emailName = process.env.EMAIL_NAME;
const emailPassword = process.env.EMAIL_PASSWORD;

//   +--------------------------------+
//   |   We connect to the database   |
//   +--------------------------------+

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});

//   +-----------------------------------------------+
//   |   Here I write the code for using the email   |
//   +-----------------------------------------------+

var transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // 465 the port if true
    auth: {
        user: emailName,
        pass: emailPassword
    }
});

transporter.verify((err, suc) => {
    if(err)
        console.log(err)
    else
        console.log('Ready for messages')
    
})

//   +---------------------------------------------------------+
//   |   We define the functions that we are going to export   |
//   +---------------------------------------------------------+

function saveToken(token, id){
    db.query(`INSERT INTO Verify_links(id_user, token) VALUES(?, ?);`, [id, token], (err, results, fields) => {
        if (err) {
            console.log(`error during the storing of the token`);
            return false
        }
        console.log(`saved link in the db: ${results.insertId}`);
        return true
    });
}

//the token is the end part of the string 
function sendVerificationEmail(email, id){
    const token = uuidv4()
    //if I didn't saved the token, I don't send the email and the user has to ask for receiving it
    saveToken(token, id)
    transporter.sendMail({
        from: {
            address: emailName,
            name: 'PrivateChatVerification'
        },
        to: email,
        subject: 'Almost done!',
        html: `Click this <a href = 'http://${serverHost}:${port}/api/auth/verifyEmail/${token}'>link</a> in order to verify your email in our application. You've done so far, congratulations!`
    }, (err, info) => {
        if (err)
            return
        console.log(info.envelope)
        console.log(info.messageId)
    });
    
}

module.exports = sendVerificationEmail
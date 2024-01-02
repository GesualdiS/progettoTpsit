//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid') // It generate unique string
const db = require('./database.js')
require('dotenv').config();
const crypto = require('crypto')

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const port = process.env.PORT;
const serverHost = process.env.SERVER_HOST;
const emailName = process.env.EMAIL_NAME;
const emailPassword = process.env.EMAIL_PASSWORD;

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
    db.query(`INSERT INTO Verify_links(id_user, token) VALUES($1, $2);`, [id, token], (err, results, fields) => {
        if (err) {
            console.log(`error during the storing of the token`);
            return false
        }
        return true
    });
}

//the token is the end part of the string 
function sendVerificationEmail(email, id){
    const token = crypto.randomBytes(32).toString('hex');
    console.log(email)
    //if I didn't saved the token, I don't send the email and the user has to ask for receiving it
    saveToken(token, id)
    transporter.sendMail({
        from: {
            address: emailName,
            name: 'PrivateChatVerification'
        },
        to: email,
        subject: 'Almost done!',
        html: `Click this <a href = 'https://${serverHost}/api/auth/verifyEmail/${token}'>link</a> in order to verify your email in our application. You've done so far, congratulations!`
    }, (err, info) => {
        if(err)
            console.log(err)
        else
            console.log(info)
    });
}

module.exports = sendVerificationEmail
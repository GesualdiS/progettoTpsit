//   +-------------------------------------------------+
//   |   I require the modules that I'm going to use   |
//   +-------------------------------------------------+

const { Pool  } = require('pg'); // more efficient than Client (google it)

//   +-------------------------------------------------+
//   |   I take the variables store in the file .env   |
//   +-------------------------------------------------+

const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_DATABASE;

//   +--------------------------------+
//   |   We connect to the database   |
//   +--------------------------------+

var db = new Pool (
    {
        host: dbHost, 
        user: dbUser, 
        password: dbPassword, 
        database: dbName, 
        port: 5432, 
        ssl: require
    }
);

module.exports = db;

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize= require('sequelize');
const sequelize = new Sequelize('database', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const dbRouter = express.Router();
dbRouter.use(bodyParser.json(), bodyParser.urlencoded({ extended: false }));

const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    password: true
  }
});

// Sincronizza il modello con il database (crea la tabella se non esiste)
sequelize.sync()
  .then(() => {
    console.log('Connesso e sincronizzato con successo con il database.');
  })
  .catch((error) => {
    console.error('Errore nella connessione o sincronizzazione con il database:', error);
  });

async function saveUser(email, password, name){
  User.create({
     email: email,
    password: password,
    username: name
  }).then((user) => {
    console.log('Utente inserito con successo:', user.email);
  })
  .catch((error) => {
    console.error('Errore durante l\'inserimento dell\'utente:', error);
  });
}

async function findUser(email, password) {
  try {
    const user = await User.findOne({
      where: {
        email: email,
        password: password,
      }
    });
    return user; // Restituisce direttamente il risultato
  } catch (error) {
    console.error('Errore durante la query:', error);
    throw error;
  }
}

async function findUserWithEmail(email) {
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    return user; // Restituisce direttamente il risultato
  } catch (error) {
    console.error('Errore durante la query:', error);
    throw error;
  }
}

dbRouter.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  findUserWithEmail(email).then((user) => {
    if (user == null) {
      console.log('Utente non trovato, procedi con la registrazione.');
      saveUser(email, password, name).then(() => {
        res.sendFile('successSignup.html', { root: __dirname + '/../public' });
      });
    } else {
      console.log('Utente trovato:', user.email);
      res.redirect('/erroreSignup');
    }
  });
});


dbRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUser(email, password);
    if (user) {
      console.log('Utente presente: ', user.email, ' ', user.password);
      res.sendFile('successSignin.html', { root: __dirname + '/../public' });
    } else {
      res.redirect('/erroreLogin');
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'autenticazione' });
  }
});


module.exports = dbRouter;

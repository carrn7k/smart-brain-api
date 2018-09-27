const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const { signin, signinAuthentication } = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

/*
const db = knex({
  client: 'pg',
  version: '10.5',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : 'you74633',
    database : 'smart-brain'
  }
});
*/

const db = knex({
  client: 'pg',
  version: '10.5',
  connection: process.env.POSTGRES_URI
});

const app = express();
// console.log('Hello, is this thing on???');
app.use(morgan('combined'));
app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send("It's Working! I hope...") })
app.post('/signin', signinAuthentication(db, bcrypt))
app.post('/register', register.signRegistration(db, bcrypt)) // handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})


// docker ip http://192.168.99.100:3000/

// Tables 
/* 
CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email text UNIQUE NOT NULL,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL,
  pet VARCHAR(100),
  age INT
);

CREATE TABLE login (
  id serial PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email text UNIQUE NOT NULL
);

*/
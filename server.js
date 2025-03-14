const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');

const authController = require('./controllers/auth.js');
const fruitsController = require('./controllers/fruits.js'); // add this

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// TODO: Fruit successfully created does not show after addding a fruit
app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    req.session.message = null;
  }
  next();
});

// TODO: where do we put res.status(500).render('index.ejs');?
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use('/auth', authController);
app.use('/fruits', fruitsController); // add this

// Handling undefined routes
app.get("*", function (req, res) {
      // res.render("error.ejs", { msg: "Page not found!" });
  res.status(404).render('error.ejs', {
    msg: 'Route not found!',  
  });
});

// server.js
const handleServerError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Warning! Port ${port} is already in use!`);
  } else {
    console.log('Error:', err);
  }
}

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
}).on('error', handleServerError);


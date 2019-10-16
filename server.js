require('dotenv').config(); // to access .env private secrets n stuff
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// CONFIG
// Passport config
require('./config/passport')(passport);

// MIDDLEWARE
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'iЛoveJesus',
    resave: true,
    saveUninitialized: true
  })
);
app.use( express.static( "public" ) );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars - my middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes - templating
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Routes - api
app.use('/api/auth', require('./routes/api/users'));
app.use('/api/beds', require('./routes/api/beds'));

// Database - mongo atlas
const db = process.env.MONGO_URI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDb connected...'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Passportjs server running on port ${PORT}..`);
});

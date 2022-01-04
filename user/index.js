const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const md5 = require('md5');
const config = require('config');

const {createAuthRouter} = require('./routes/auth');
const {createRootRouter} = require('./routes/root');

const app = express();
let sessions = {};

const authRouter = createAuthRouter({sessions});
const rootRouter = createRootRouter({sessions});

mongoose.connect(config.mongodb);
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365,
  },
  resave: true,
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const auth = (req, res, next) => {
  const sessionId = req.cookies['connect.sid'];
  if (sessions[sessionId]) {
    req.sessionId = sessionId;
    req.user = sessions[sessionId];
    next();
  } else {
    res.redirect('/auth/login');
  }
}

app.use('/auth', authRouter);
app.use('/', auth, rootRouter);

app.listen(config.user.port);
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const accountRoute = require('./routes/accounts');

const app = express();

mongoose.connect(config.get('mongodb'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/accounts', accountRoute);

app.listen(config.get('admin.port'));

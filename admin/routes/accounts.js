const express = require('express')
const moment = require('moment');
const { nanoid } = require('nanoid');
const config = require('config');
const fileUpload = require('express-fileupload');
const md5 = require('md5');

const { User, Account } = require('./../models');

const AccountRoute = express.Router();
const uploadPath = config.get('uploadPath');

AccountRoute.use(fileUpload());

AccountRoute.get('/', async (req, res) => {
  const accounts = await Account.find();
  console.log(accounts)
  res.render('accounts/list', {
    accounts,
  })
});

AccountRoute.get('/add', (req, res) => {
  res.render('accounts/add');
});

AccountRoute.post('/add', async (req, res) => {
  const {title} = req.body;
  const accountId = await Account.count() + 1;
  console.log('account add', {title, accountId});
  const account = new Account({
    accountId,
    title,
  });
  await account.save();
  res.redirect('/accounts');
});


AccountRoute.get('/:accountId/users', async (req, res) => {
  const {accountId} = req.params;
  const account = await Account.findOne({ accountId });
  res.render('accounts/users/list', {
    account,
  })
});

AccountRoute.get('/:accountId/users/json', async (req, res) => {
  const {accountId} = req.params;
  const users = await User.find({ accountId });
  res.json({ data: users });
});

AccountRoute.get('/:accountId/add', async (req, res) => {
  let {accountId} = req.params;
  res.render('accounts/users/add', {
    accountId,
  });
});

AccountRoute.post('/:accountId/add', async (req, res) => {
  const userId = await User.count({}) + 1;
  const {accountId} = req.params;
  const dateCreated = moment().format('YYYY-MM-DD HH:mm:ss');
  const {name, email, phone} = req.body;

  const user = new User({
    accountId,
    userId,
    name,
    dateCreated,
    email,
    phone,
  });
  await user.save();
  res.redirect('/accounts/' + accountId + '/users');
});

AccountRoute.get('/:accountId/password/:userId', async (req, res) => {
  const {accountId, userId} = req.params;
  const password = nanoid();
  const passwordHash = md5(password);
  console.log(password, passwordHash);
  await User.updateOne({userId}, { 
    $set: { passwordHash },
  });
  res.redirect('/accounts/' + accountId + '/users');
});

AccountRoute.get('/:accountId/users/:userId/', async (req, res) => {
  const {userId} = req.params;
  const user = await User.findOne({userId});
  res.render('accounts/users/profile', {user});
});

AccountRoute.get('/:accountId/users/:userId/avatar', async (req, res) => {
  const {accountId, userId} = req.params;
  // const user = await User.findOne({userId, accountId});
  const imgpath = `${uploadPath}/${userId}.png`;
  res.sendFile(imgpath);
});

AccountRoute.get('/:accountId/users/:userId/upload', async (req, res) => {
  const {accountId, userId} = req.params;
  res.render('accounts/users/upload', {accountId, userId});
});

AccountRoute.post('/:accountId/users/:userId/upload', async (req, res) => {
  const {accountId, userId} = req.params;
  const imgpath = `${uploadPath}/${userId}.png`;
  console.log(req.files, {accountId, userId, imgpath});
  await req.files.avatar.mv(imgpath);
  await User.updateOne({userId}, {
    $set: { imgpath },
  });
  res.redirect(`/accounts/${accountId}/users/${userId}`);
});

module.exports = AccountRoute;

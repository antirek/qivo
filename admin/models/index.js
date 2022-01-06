const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  accountId: String,
  userId: Number,
  dateCreated: String,
  email: String,
  phone: String,
  passwordHash: String,
  avatar: String,
});

const AccountSchema = new mongoose.Schema({
  title: String,
  accountId: Number,
});

const VideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    unique: true,
    index: true,
  },
  title: String,
  dateCreated: String,
  userId: String,
  accountId: String,
  extension: String,
  mimetype: String,
  secret: String,
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);
const Video = mongoose.model('Video', VideoSchema);

module.exports = { 
  User,
  Account,
  Video,
};
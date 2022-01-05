const express = require('express')
const md5 = require('md5');

const { User } = require('../../admin/models');

const createAuthRouter = () => {
  const authRouter = express.Router();

  authRouter.get('/login', (req, res) => {
      const sessionId = req.cookies['connect.sid'];
      console.log('get login', {
        sessions: req.sessions, sessionId, sess: req.sessionId,
      });
      if (req.sessions[sessionId]) {
        res.redirect('/');
      } else {
        res.render('auth/login');
      }
  });

  authRouter.post('/login', async (req, res) => {
    const sessionId = req.cookies['connect.sid'];
    const {phone, password} = req.body;
    const user = await User.findOne({phone});

    if(user && md5(password) === user.passwordHash) {
      console.log('post login', {sessions: req.sessions});
      req.sessions[sessionId] = user;
      console.log('sessions', req.sessions);
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  });

  authRouter.get('/logout', (req, res) => {
    console.log('get logout');
    const sessionId = req.cookies['connect.sid'];
    delete req.sessions[sessionId];
    console.log('sessions', {sessions: req.sessions, sessionId});
    res.redirect("/auth/login");
  })

  return authRouter;
}

module.exports = { createAuthRouter };
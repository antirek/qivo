const express = require('express')
const md5 = require('md5');

const { User } = require('../../admin/models');

const createAuthRouter = ({sessions}) => {
  const authRouter = express.Router();

  authRouter.get('/login', (req, res) => {
      const sessionId = req.cookies['connect.sid'];
      console.log('get login', {sessions, sessionId, sess: req.sessionId})
      if (sessions[sessionId]) {
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
      console.log('post login', {sessions});
      sessions[sessionId] = user;
      console.log('sessions', sessions);
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  });

  authRouter.get('/logout', (req, res) => {
      req.session.destroy();
      res.redirect("/auth/login")
  })

  return authRouter;
}

module.exports = { createAuthRouter };
const express = require('express');

const { Video } = require('./../../admin/models');

const createRootRouter = () => {
  const rootRouter = express.Router();

  rootRouter.get('/', async (req, res) => {
    const accountId = req.user.accountId;
    const videos = await Video.find({accountId}).sort({dateCreated: -1});
    
    res.render('dashboard', {
      user: req.user,
      videos,
    });
  });
  return rootRouter;
}

module.exports = {createRootRouter};
const express = require('express');
const moment = require('moment');
const config = require('config');
const path = require('path');

const { Video } = require('./../../admin/models');
const uploadPathVideos = config.uploadPathVideos;

const createShareRouter = () => {
  const shareRouter = express.Router();

  shareRouter.get('/media/:videoId/:secret', async (req, res) => {
    const {videoId, secret} = req.params;
    const video = await Video.findOne({videoId, secret});
    if (!video) {
      return res.status(404).json({status: 'Not Found'});
    }
    const videoFilename = `${video.videoId}.${video.extension}`;
    const videoPath = path.join(uploadPathVideos, video.userId, videoFilename);

    res.sendFile(videoPath);
  });

  return shareRouter;
}

module.exports = {createShareRouter};
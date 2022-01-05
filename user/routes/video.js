const express = require('express');
const fileUpload = require('express-fileupload');
const {nanoid} = require('nanoid');
const moment = require('moment');
const config = require('config');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const { Video } = require('./../../admin/models');
const uploadPathVideos = config.uploadPathVideos;

const createVideoRouter = () => {
  const videoRouter = express.Router();

  videoRouter.use(fileUpload());
  videoRouter.get('/upload', async (req, res) => {
    res.render('video/upload');
  });

  videoRouter.post('/upload', async (req, res) => {
    console.log('post video', req.files, req.body, req.user);
    const user = req.user;
    const videoFile = req.files.video;
    const extension = mime.extension(videoFile.mimetype);
    const videoId = nanoid();
    const videoPath = path.join(uploadPathVideos, user.userId.toString());
    await fs.promises.mkdir(videoPath, { recursive: true });

    const videoFilename = `${videoId}.${extension}`;

    console.log('video path', {extension, videoPath, videoFilename});
    await videoFile.mv(path.join(videoPath, videoFilename));

    const video = new Video({
      videoId,
      userId: user.userId,
      accountId: user.accountId,
      title: req.body.title,
      dateCreated: moment().format('YYYY-MM-DD HH:mm:ss'),
      extension,
      mimetype: videoFile.mimetype,
    });

    await video.save();

    res.redirect('/');
  });

  videoRouter.get('/:videoId', async (req, res) => {
    const {videoId} = req.params;
    const video = await Video.findOne({videoId});
    if (!video) {
      return res.status(404).json({status: 'Not Found'});
    }
    const videoFilename = `${video.videoId}.${video.extension}`;
    const videoPath = path.join(uploadPathVideos, video.userId, videoFilename);

    res.sendFile(videoPath);
  });

  return videoRouter;
}

module.exports = {createVideoRouter};
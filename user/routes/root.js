const express = require('express');

const createRootRouter = ({sessions}) => {
    const rootRouter = express.Router();

    rootRouter.get('/', (req, res) => {
        res.render('user', {user: req.user});
    });
    return rootRouter;
}

module.exports = {createRootRouter};
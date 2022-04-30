const express = require('express');
const User = require('../models/User.js');
const router = express.Router();

router.get("/", async function (req, res) {
    const users = await User.find();
    res.status(200).send(users);
});

module.exports = router;
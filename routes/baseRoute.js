const config = require('../config')
const express = require('express');
const path = require('path')

let router = express.Router();

router.use(express.static(path.join(__dirname, '../public/')))

router.get(config.baseUrl, (req, res) => {
    res.sendFile('index.html', {root: './views/'});
});

module.exports = router
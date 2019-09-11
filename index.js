const express = require('express');
const config = require('./config');
const router = require('./routes/baseRoute')

const app = express();
require('./routes/dirTree')(app, config);

app.use(config.baseUrl, router);

app.listen(config.port, (err) => {
    if (err){
        return console.log(err);
    }
    console.log(`Server is running on localhost:${config.port}`)
});
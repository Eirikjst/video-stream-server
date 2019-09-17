let bodyParser = require('body-parser');
const config = require('./config');
const express = require('express');
const router = require('./routes/baseRoute')

const app = express();
app.use(config.baseUrl, router);
app.use(bodyParser.json());

require('./routes/dirTree')(app, config);
require('./routes/videoStream')(app, config);

app.listen(config.port, (err) => {
    if (err){
        return console.log(err);
    }
    console.log(`Server is running on localhost:${config.port}`)
});
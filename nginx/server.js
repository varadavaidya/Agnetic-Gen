const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const app_name = process.env.APP_NAME

app.use('/images' , express.static(path.join(__dirname, 'images')));



app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log(`Request served by node app for ${app_name}`);
    });

app.listen(port, () => {
    console.log(` ${app_name} Server is running on port ${port}`);
});
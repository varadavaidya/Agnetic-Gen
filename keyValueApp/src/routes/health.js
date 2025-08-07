const express = require('express');

const healthRouter = express.Router();


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP!' });
});


module.exports ={healthRouter,};
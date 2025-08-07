const express = require('express');

const keyValueRouter = express.Router();

keyValueRouter.post('/', (req, res) => {
    return res.send('creating a new key-value pair');
});
keyValueRouter.post('/:key',(req, res) => {
    return res.send('getting a key-value pair');
});
keyValueRouter.put('/:key', (req, res) => {
    return res.send('updating a key-value pair');
});  
keyValueRouter.delete('/:key', (req, res) => {
    return res.send('deleting a key-value pair');
});

module.exports ={keyValueRouter,};
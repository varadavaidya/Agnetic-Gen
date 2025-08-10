const express = require('express');

const mongoose = require('mongoose');
const {notebookRouter} = require('./routes');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/api/notebooks',notebookRouter);

const port = process.env.PORT;

mongoose.connect(process.env.DB_URL).then(()=> {
    console.log('Connected to MongoDB:  Starting server');
app.listen(port, () => {
    console.log(`notebooks server listening on port ${port}`);
});
}).catch(err => {   
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

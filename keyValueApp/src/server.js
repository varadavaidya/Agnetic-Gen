const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {keyValueRouter} = require('./routes/store');
const {healthRouter} = require('./routes/health');

const port = process.env.PORT ;
const app = express();

app.use(bodyParser.json());
app.use('/health', healthRouter);
app.use('/store', keyValueRouter);


console.log('Connecting to MongoDB...');


mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.KEY_VALUE_DB}`, {
    auth:{
        username: process.env.KEY_VALUE_USER,
        password: process.env.KEY_VALUE_PASSWORD
    },
    connectTimeoutMS: 500 
})
  .then(() => {console.log('MongoDB connected')
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
    console.log('Connected to DB');
    })
  .catch(err =>{ 
    console.error('Failed to connect to MongoDB');
    console.error('MongoDB connection error:', err)
});

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotebookSchema = new schema({
    name:{
        type: String,
        required: true,
        unique: true        
    },
    description: {
        type: String,
        required: false,
        default: null,
    },
},
{timestamps: true}
);

const Notebook = mongoose.model('Notebook', NotebookSchema);

module.exports = {
    Notebook,
};

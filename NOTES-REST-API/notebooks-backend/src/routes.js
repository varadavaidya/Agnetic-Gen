const express=require('express');
const {Notebook} = require('./models');

const notebookRouter = express.Router();

//Create new notebooks: POST '/' 
// Retrive all notebooks: GET '/' 
// Retrieve a notebook by ID: GET '/:id' - localhost:3000/api/notebooks/some-id
// Update a notebook: PUT '/:id' - localhost:3000/api/notebooks/some-id
// Delete a notebook: DELETE '/:id' - localhost:3000/api/notebooks/some-id

notebookRouter.post('/', async (req, res) => {
    try {
        const {name, description} = req.body;
        if(!name){
            return res.status(400).json({error: 'Name is required'});
        }
        const notebook = new Notebook({name, description});
        await notebook.save();
        return res.status(201).json({data: notebook});
    }
    catch(err){
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


notebookRouter.get('/', async (req, res) => {
    try {
        const notebooks = await Notebook.find();
        return res.status(200).json({data: notebooks});
    } catch (err) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


notebookRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const {id} = req.params;
        const notebook = await Notebook.findById(id);
        if (!notebook) {
            return res.status(404).json({error: 'Notebook not found'});
        }
        return res.status(200).json({data: notebook});
    } catch (err) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


notebookRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name, description} = req.body;
    try {
        const notebook = await Notebook.findByIdAndUpdate(id, {name, description}, {new: true});
        if (!notebook) {
            return res.status(404).json({error: 'Notebook not found'});
        }
        return res.status(200).json({data: notebook});
    } catch (err) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


notebookRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const notebook = await Notebook.findByIdAndDelete(id);
        if (!notebook) {
            return res.status(404).json({error: 'Notebook not found'});
        }
        return res.status(200).json({message: 'Notebook deleted successfully'});
    } catch (err) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
});





notebookRouter.get('/', async (req, res) => {
    res.json({message: 'Hello from notebooks'});
});

module.exports = {
    notebookRouter,
};  
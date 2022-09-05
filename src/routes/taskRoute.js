const express = require('express');
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js');
const User = require('../models/user');
const { response } = require('express');
const router = new express.Router();

// ?completed = true
//limit and skip to do pagination
// sortBy=createdAt_asc or createdAt_desc or replace _ with :
router.get('/tasks', auth, async (req,res)=> {

    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try{
        // const tasks = await Task.find({owner: req.user._id});
        User.findOne({_id: req.user._id}).populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).exec(function(err, result){
            res.send(result.tasks);
        });

    } catch(err){
        res.status(500).send();
    }

});

router.get('/tasks/:taskID', auth, async (req,res)=> {
    const taskID = req.params.taskID;

    try{
        // const task = await Task.findById(taskID);
        const task = await Task.findOne({_id: taskID, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch(err){
        res.status(500).send();
    }
});

router.post('/tasks', auth, async (req,res)=> {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    } catch(err){
        res.status(400).send(err);
    }
});

router.patch('/tasks/:taskId', auth, async (req,res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidUpdate){
        return res.status(404).send({"Error": "Some Properties Do Not Exist"});
    }

    try{
        const task = await Task.findOne({_id: req.params.taskId, owner: req.user._id});

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {new:true, runValidators: true});
        
        res.send(task);
    } catch(err){
        res.status(400).send(err);
    }

});

router.delete('/tasks/:taskId', auth, async(req,res)=> {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.taskId, owner: req.user._id});
        if(!task){
            return res.status(400).send();
        }
        res.send(task); 
    } catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;
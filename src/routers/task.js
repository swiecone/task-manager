const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

//Create a new task 
router.post('/tasks', async (req, res) =>{
    const task = new Task(req.body)
    console.log(task)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Get a list of all the tasks 
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get one specific task from the list 
router.get('/tasks/:id', async (req, res) =>{
    const _id = req.params.id 

    try {
        const task = await Task.findById({_id})

        if (!task) {
            res.status(404).send("task not found")
        } 
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Update a task 


router.patch('/tasks/:id', async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['task', 'completed']
    const isValidOperation = updates.every((update) => {
 
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send('error: Invalid parameter in the update ')
    }

    try {
        
    //    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
    
    const task = await Task.findById(req.params.id)
   
    
        if (!task) {
            return res.status(404).send('No task found, please check if user exists')
        }

        updates.forEach((update) =>  task[update] = req.body[update])
        await task.save()
    
    
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', async (req, res) =>{
    
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        console.log(req.params.id)
//        console.log(task)
        
        if (!task) {
            return res.status(404).send("The task you want to delete has not been found")
        }

        res.send(task)
    
    } catch (e) {
        res.status(500).send("The error is: " +e)
    }
})

module.exports = router 
const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//Create a new task 
router.post('/tasks', auth,  async (req, res) =>{
  const task = new Task({
      ...req.body,
      owner: req.user._id
  })  
  
  console.log(task)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Get a list of all the tasks 
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
       // console.log(match.completed)
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        // console.log(parts)
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    //    console.log(sort[parts[0]])
    }

    try {
          await req.user.populate({
              path: 'tasks', 
              match,
              options:{
                  limit: parseInt(req.query.limit),
                  skip: parseInt(req.query.skip), 
                  sort
              }
          }).execPopulate()

        res.send(req.user.tasks)

       } catch (e) {
        res.status(400).send(e)
    }
})

//Get one specific task from the list 
router.get('/tasks/:id', auth, async (req, res) =>{
    const _id = req.params.id 

    try {
       // const task = await Task.findById({_id})
       const task = await Task.findOne({ _id, owner: req.user._id})

        if (!task) {
            res.status(404).send("task not found")
        } 
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Update a task 
router.patch('/tasks/:id', auth, async (req, res) =>{
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
    
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id } )
   
    
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) =>  task[update] = req.body[update])
        await task.save()
    
    
        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', auth, async (req, res) =>{
    
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id } )
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
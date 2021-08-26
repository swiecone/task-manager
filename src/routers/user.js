const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')



// User registration  
router.post('/users', async (req, res) =>{
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()


        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

})

// User login end point 
router.post('/users/login', async (req, res) => {
   
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        if (!user) {
            res.status(400).send("User does not exist")
        }

        res.send({ user , token })
    } catch (e) {
        console.log(e)
        res.status(400).send("Error encountered")
    }
})

router.post('/users/logout', auth, async (req, res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('user correctly logged out')
       
    } catch (e) {
        res.status(500).send()
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('user correctly logged out from all devices')
    } catch (e) {
        res.status(500).send()

    }
})

// Get a list of all the users 
// as a user I should not have access to all users 

router.get('/users',auth , async (req, res) =>{
   // const users = User.find({})

    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(error)
    }
})


// Get my user
router.get('/users/me', auth , async (req, res) => { 
    res.send(req.user)

 })

router.patch('/users/me', auth, async (req, res) =>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send('error: Invalid parameter in the update ')
    }

    try {
      
       updates.forEach((update) =>  req.user[update] = req.body[update])
       await req.user.save()
       res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) =>{
    try {
     //   console.log(req.params.id)
        const user = await User.findByIdAndDelete(req.user._id)
        console.log(user)
        await req.user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router 
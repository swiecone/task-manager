const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendByeByeEmail } = require('../emails/account')


// User registration  
router.post('/users', async (req, res) =>{
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        console.log('email sent to '+ user.name)
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
        sendByeByeEmail(user.email, user.name)
        console.log('email sent to email '+ user.email+' with id '+ user._id)
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})



// This shows where the upload folder of files is. 
// This will be images folder in root directory 
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a image (jpg, jpeg, png)'))
       }
       
        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {   
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

      req.user.avatar = buffer  
    await req.user.save()
    res.send({response: 'File uploaded correctly to the server.'})
}, (error, req, res, next) => {
    res.status(400).send({error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined 
    await req.user.save()
    res.send({response: 'avatar deleted correctly'})
})

router.get('/users/:id/avatar', async (req, res) =>{
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router 
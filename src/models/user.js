
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true 
    }, 
    age: {
        type: Number,
        required: true, 
        validate(value) {
            if (value <= 16 ) {
                throw new Error('Age must be over 16 years')
            }
        }
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true, 
        lowercase: true, 
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("This is not a valid email.")
            }
        }
    }, 
    password: {
        type: String, 
        required: true, 
        trim: true, 
        minlength: 11,
        validate(value) {
            if(value.includes("password")) {
                throw new Error("Are you joking? Password cannot contain the word passowrd!")
            }
        }

    }, 
    tokens: [{
        token: {
            type: String, 
            required: true 
        }
    }], 
    avatar: {
        type: Buffer 
    }
    
}, {
    timestamps: true 
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
  

    if (!user) {
        throw new Error("Unable to login")
    }
   
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user 
}

userSchema.methods.generateAuthToken = async function () {
    const user = this 

    token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcoursealex')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON =  function () {
    const user = this 
    const userObject =  user.toObject()

    delete  userObject.password
    delete  userObject.tokens 
    delete  userObject.__v
    delete  userObject.age 
    delete userObject.avatar
    delete userObject.createdAt
    delete userObject.updatedAt
     

    return userObject
}



// Hash the pain text password 
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})

// Delete the tasks when a user is removed

userSchema.pre('remove', async function (next) {
    const user = this 
    await Task.deleteMany({owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User
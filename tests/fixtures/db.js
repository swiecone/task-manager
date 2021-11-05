const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId, 
    name: 'Mike', 
    email: 'mike@mike.com',
    password: 'Thisismywordpass',
    age: 42, 
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SALT)
    }]
}

const setUpDataBase = async () => {
    await User.deleteMany()    
    await new User(userOne).save()
}

module.exports = {
    userOneId, 
    userOne, 
    setUpDataBase
}
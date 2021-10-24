const jwt = require('jsonwebtoken')
const User = require('../models/user')

// This method is used to make sure a user is authenticated
// If the user is authenticated, the method sends back the user & token 
// If user is not authenticated or user does not exist, it throws an error 

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SALT)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) 
        
        if(!user) {
            console.log("auth no user found")
            throw new Error()
        }

        req.token = token
        req.user = user 
       // console.log(req.user)
        next()

    } catch(e) {
        res.status(401).send({error: 'Please Authenticate'})
    }
   
}

module.exports = auth
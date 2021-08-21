const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    task: {
        type: String, 
        default: false, 
        required: false, 
        trim: true 
    },
    completed: {
        type: Boolean, 
        required: false 
    } 
})

module.exports = Task
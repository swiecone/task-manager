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
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    }
})

module.exports = Task
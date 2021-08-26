const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
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
    }, {
        timestamps: true 
    }
)


taskSchema.methods.toJSON =  function () {
    const task = this 
    const taskObject =  task.toObject()

    delete  taskObject.owner 
    delete taskObject.createdAt
    delete taskObject.updatedAt
    delete taskObject.__v
     

    return taskObject
}


const Task = mongoose.model('Task', taskSchema)

module.exports = Task
require('../src/db/mongoose')
const Task = require('../src/models/task')

// ID to delete: 60f48cafdb8c640c494f7e5c

// Task.findByIdAndRemove('60f48cafdb8c640c494f7e5c').then((task) =>{
//     console.log(task)
//     return User.countDocuments({completed: false})
// }).then((result) =>{
//     console.log("Number of incompleted tasks: "+result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments({completed: false})
    return count 
} 

deleteTaskAndCount('60f47da5db8c640c494f7e5b').then((count) =>{
    console.log(count)
}).catch((e)=>{
    console.log('e', e)
})
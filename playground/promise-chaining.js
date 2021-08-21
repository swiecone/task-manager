require('../src/db/mongoose')
const User = require('../src/models/user')

// ID to update: 60ef34f06833510ad5f59e47

// User.findByIdAndUpdate('60ef34f06833510ad5f59e47', {name: "Alexander"}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({name:"Alexander"})
// }).then((result) =>{
//     console.log("Users with the name Alexander: "+result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeandCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age })
    const count = await User.countDocuments({ age })
    return user 
}

updateAgeandCount('60ef40f3fb8d320cf4fb6208', 2).then((user) => {
    console.log(user)
}).catch((e) =>{
    console.log(e)
})
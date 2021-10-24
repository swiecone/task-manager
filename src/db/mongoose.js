const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_LOCAL, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false     
})


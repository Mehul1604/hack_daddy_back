const mongoose = require('mongoose')



const url  = process.env.MONGODB_URI

console.log('connecting to daddy..' , url)
mongoose.connect(url , {useNewUrlParser : true , useUnifiedTopology : true})
.then(res =>{
    console.log('connected to daddy!')
})
.catch(err =>{
    console.log('connection failed :(' , err.message)
})
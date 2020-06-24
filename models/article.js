
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

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : true,
        maxlength : 400
    }

})

articleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Article = mongoose.model('Article' , articleSchema)
module.exports = Article
  
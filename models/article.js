
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
        required : true,
        maxlength : 40
        
    },
    summary : {
        type : String,
        required : true,
        maxlength : 400
    },
    tagline : {
        type : String,
        required : true
    },
    contributor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : '000000000000000000000000'
       
    },
    publish_date : {
        type : mongoose.Schema.Types.Date,
        default : Date.now()
    },
    ref_links : {
        type : mongoose.Schema.Types.Array,
        default : []
    },
    comments : [{
        user : mongoose.Schema.Types.ObjectId,
        priority : mongoose.Schema.Types.Number,
        body : mongoose.Schema.Types.String,
        replies : [{
            user : mongoose.Schema.Types.ObjectId,
            body : mongoose.Schema.Types.String
        }]
    }],
    report_val : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    followers : {
        type : mongoose.Schema.Types.Number,
        default : 0
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
  
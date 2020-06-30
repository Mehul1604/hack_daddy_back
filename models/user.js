const mongoose = require('mongoose')

const url  = process.env.MONGODB_URI
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

// console.log('connecting to daddy..' , url)
// mongoose.connect(url , {useNewUrlParser : true , useUnifiedTopology : true})
// .then(res =>{
//     console.log('connected to daddy!')
// })
// .catch(err =>{
//     console.log('connection failed :(' , err.message)
// })

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : 40
        
    },
    email : {
        type : String,
        required : true,
        maxlength : 40
    },
    username : {
        type : String,
        required : true,
        maxlength : 15
    },

    password : {
        type: String, 
        required : true
    },

    role : {
        type : Boolean,
        required : true,
        default : false
    },
    rating : {
        type : mongoose.Schema.Types.Number,
        required : true,
        default : 1000
    },

    follow_id : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Article',
        default : []
    }
],

    contributor_id : [
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Article',
        default : []
    }
]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
 
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
 
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
 
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User' , userSchema)
module.exports = User

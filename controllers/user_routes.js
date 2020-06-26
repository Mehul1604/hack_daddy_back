const userRouter = require('express').Router()

const User = require('../models/user') 

userRouter.get('/' , (req,res) =>{
    User.find({}).then(result =>{
        res.json(result)
    })
})

userRouter.get('/:id' ,(req,res) =>{
    User.findById(req.params.id).then(result =>{
        res.json(result)
    })
})

userRouter.post('/' ,(req,res) =>{
    const body = req.body
    const newUser = new User({
    
    name : body.name,
    email : body.email,
    username : body.username,
    password : body.password,
    role : body.role,
    rating : body.rating,
    follow_id : body.follow_id,
    contributor_id : body.contributor_id,

})

    newUser.save().then(result =>{
        res.json(result)
        console.log('user saved')
    })
    .catch(err =>{
        console.log(err)
    })
})

userRouter.delete('/:id' ,(req,res) =>{
    User.findByIdAndDelete(req.params.id).then(result =>{
        res.send('<h2>User deleted</h2>').redirect('../')
        
    })
})

module.exports = userRouter
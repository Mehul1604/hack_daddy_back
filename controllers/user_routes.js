const userRouter = require('express').Router()

const jwt = require('jsonwebtoken')

const Article = require('../models/article') 

const User = require('../models/user') 

const getToken = (request) =>{
    const Auth = request.get('authorization')
        if(Auth && Auth.toLowerCase().startsWith('bearer ')){
            return Auth.substring(7)
        }

        return null
}

userRouter.get('/' , (req,res) =>{
    User.find({}).then(result =>{
        res.json(result)
    })
})

userRouter.get('/getSingleUser' ,(req,res) =>{

    const token = getToken(req)
    const decodedUser = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedUser.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }
    User.findById(decodedUser.id).populate('contributor_id follow_id').then(result =>{
        res.json(result)
    })
})

userRouter.get('/viewFollowed/:id' , async (req,res) =>{

    const UserToShow = await User.findById(req.params.id).populate('follow_id')
    console.log(UserToShow)
    return res.json({
        followedArticles : UserToShow.follow_id 
    })

})

userRouter.get('/viewPosted/:id' , async (req,res) =>{

    const UserToShow = await User.findById(req.params.id).populate('contributor_id')
    console.log(UserToShow)
    return res.json({
        postedArticles : UserToShow.contributor_id 
    })

})

userRouter.post('/' ,(req,res) =>{
    const body = req.body
    const newUser = new User({
    
    name : body.name,
    email : body.email,
    username : body.username,
    password : body.password,
    role : body.role
    

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

userRouter.put('/updateUser/:id/' , async (req,res) =>{
    
    const newValues = req.body
    const token = getToken(req)
    const decodedUser = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedUser.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const UserToChange = await User.findById(req.params.id)
    UserToChange.name = newValues.name ? newValues.name : UserToChange.name
    UserToChange.email = newValues.email ? newValues.email : UserToChange.email
    UserToChange.username = newValues.username ? newValues.username : UserToChange.username
    if(newValues.password){
        UserToChange.password = newValues.password
    }
    console.log(UserToChange)
    const updatedUser = await UserToChange.save()
    return res.json({
        'userUpdated' : updatedUser
    })
    
})

userRouter.put('/roleUpdate/:id' , async (req,res) =>{
    const token = getToken(req)
    const decodedUser = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedUser.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    User.findByIdAndUpdate(req.params.id , {role : true} , {new : true}).then(result =>{
        res.json(result)
    })
})

userRouter.put('/ratingUpdate/:id' , async (req,res) =>{
    const ratingDelta = req.body.delta
    const token = getToken(req)
    const decodedUser = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedUser.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const UserToChange = await User.findById(req.params.id)
    UserToChange.rating = UserToChange.rating + ratingDelta
    const updatedRatingUser = await UserToChange.save()
    res.json(updatedRatingUser)
})

module.exports = userRouter
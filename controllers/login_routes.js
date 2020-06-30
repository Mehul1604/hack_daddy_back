const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')


//LOGIN ROUUUUUTES

loginRouter.post('/' , async (req,res) =>{
    const body = req.body
    const existingUser = await User.findOne({username : body.username})
    var isPasswordCorrect;
    if(existingUser){
        isPasswordCorrect = bcrypt.compare(body.password , existingUser.password)
    }
    else{
        isPasswordCorrect = false
    }

    if(!(existingUser && isPasswordCorrect)){
        return res.status(401).json({
            error : 'invalid username or password'
        })
    }
    

    const tokenReadyUser = {
        username : existingUser.username,
        id : existingUser._id
    }

    const token = jwt.sign(tokenReadyUser , process.env.SECRET_TOKEN)
    res.status(200).send({
        access_token : token,
        username : existingUser.username,
        name : existingUser.name

    })
})

module.exports  =  loginRouter
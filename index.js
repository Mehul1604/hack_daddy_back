require('dotenv').config()
const express = require('express')
const articleRouter = require('./controllers/article_routes')
const userRouter = require('./controllers/user_routes')
const loginRouter = require('./controllers/login_routes')
const cors = require('cors')
const User = require('./models/user')
const app = express()


//MIDDLEWARE
const consoleLogger = (req , res , next) =>{
    console.log({"Body" : req.body})
    console.log({"Path" : req.path})
    console.log({"Method" : req.method })
    console.log("__--__--__--__")
    next()
}

const errorHandler = (err , req , res , next) =>{
    console.log(err.message)
    if(err.name === 'CastError'){
        return res.status(400).send({error : 'validation of a type failed'})
    }
    
    next(err)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    }


const extractRequestToken = (req,res,next) =>{
    const auth_token = req.header('authorization')
    if(auth_token && auth_token.toLowerCase().startsWith('bearer ')){
        req.token = auth_token
    }
    else{
        req.token = null
    }

    next()
}
app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(extractRequestToken)
app.use(consoleLogger)
app.use(errorHandler)
app.use('/articles' , articleRouter)
app.use('/user', userRouter)
app.use('/login' , loginRouter)
app.get('/' , (req,res)=>{
    res.send('<h1>backend</h1>')
})

app.use(unknownEndpoint)

// const newUser = new User({
//    name : 'Aakasnoooo',
//    email : 'aakastest',
//    username : 'megool',
//    password : 'raghavisgay',
//   role : true,
//    rating : 1000,
//    follow_id : ['why','who'],
//    contributor_id : ['why(2)']
   
// })

// newUser.save().then(res =>{
//    console.log(newUser)
// })
// .catch(err =>{
//     console.log(err)
// })


const PORT = process.env.PORT || 8000

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})

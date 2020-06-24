require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const consoleLogger = (req , res , next) =>{
    console.log({"Body" : req.body})
    console.log({"Path" : req.path})
    console.log({"Method" : req.method })
    console.log("__--__--__--__")
    next()
}

const errorHandler = (err , req , res , next) =>{
    console.log(err.message)
    return res.status(400).send({error : err.message})

    next(err)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    }

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(consoleLogger)
app.use(errorHandler)

app.get('/' , (req,res)=>{
    res.send('<h1>backend</h1>')
})


app.use(unknownEndpoint)


const PORT = process.env.PORT || 8000

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})

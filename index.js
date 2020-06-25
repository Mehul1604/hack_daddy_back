require('dotenv').config()
const express = require('express')
const articleRouter = require('./controllers/article_routes')
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
    if(err.name === 'CastError'){
        return res.status(400).send({error : 'validation of a type failed'})
    }
    
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
app.use('/articles' , articleRouter)


app.get('/' , (req,res)=>{
    res.send('<h1>backend</h1>')
})

// const newArticle = new Article({
    
//     title : 'Test3',
//     summary : 'testes',
//     tagline : 'Movies',
//     ref_links : ['google link'],
//     comments : [{
//         user : 'Mehul',
//         priority : 1000,
//         body : 'yas',
//         replies : [{
//             user : 'Aakash',
//             body : 'No'
//         }]
//     }],
//     report_val : 22.3
// })

// newArticle.save().then(res =>{
//     console.log('article saved')
// })
// .catch(err =>{
//     console.log(err)
// })


app.use(unknownEndpoint)



const PORT = process.env.PORT || 8000

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
})

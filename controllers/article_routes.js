const articleRouter = require('express').Router()
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

articleRouter.get('/' , (req,res) =>{
    Article.find({}).then(result =>{
        res.json(result)
    })
})

articleRouter.get('/:id' ,(req,res) =>{
    Article.findById(req.params.id).populate('contributor').then(result =>{
        if(result){
            res.json(result)
        }
        else{
            res.status(404).json({'error404' : 'incorrect article id / article no longer exists'})
        }
        
    })
    .catch(err =>{
        res.json(err)
    })
})

articleRouter.post('/' ,async (req,res) =>{
    const body = req.body
    const token = getToken(req)
    const decodedToken = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedToken.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const userWhoPosted = await User.findById(decodedToken.id)

    const newArticle = new Article({
    
    title : body.title,
    summary : body.summary,
    tagline : body.tagline,
    ref_links : body.ref_links,
    comments : body.comments,
    report_val : body.report_val,
    contributor : userWhoPosted._id

})

    const result = await newArticle.save()
    console.log("article saved")
    console.log(result)

    User.findByIdAndUpdate(userWhoPosted._id , {$push : {contributor_id : result._id}} , {new : true}).then(updated =>{
        console.log("updated user with this article" , updated)
        res.json(updated)
    })
})

articleRouter.delete('/:id' ,(req,res) =>{
    Article.findByIdAndDelete(req.params.id).then(result =>{
        res.send('<h2>Article deleted</h2>').redirect('../')
        
    })
})

articleRouter.put('/comment/:id',(req,res)=>{
    const newComment = req.body
    Article.findByIdAndUpdate(req.params.id , {$push : {comments : newComment}} , {new : true}).then(result =>{
        console.log("comment added" , result)
        res.json(result.comments[result.comments.length - 1])
    })
})

articleRouter.patch('/comment/:id/:commentid/reply/' , async (req,res) =>{
    const newReply = req.body
    const article = await Article.findById(req.params.id)
    //console.log(article)
    console.log('ID REQUESTED' , (req.params.commentid))
    console.log('ORIGINAL COMMENTS ARRAY',article.comments)
    //console.log(typeof(article.comments[0]._id))
    const comment_ind = article.comments.findIndex((c) => {
        
        return c._id.toString() === req.params.commentid
    })
    console.log(comment_ind)
    console.log(article.comments[comment_ind])
    article.comments[comment_ind].replies.push(newReply)
    Article.findByIdAndUpdate(req.params.id , {comments : article.comments} , {new : true}).then(updatedRow =>{
        console.log(updatedRow.comments)
        res.json(updatedRow.comments)
    })
})

module.exports = articleRouter
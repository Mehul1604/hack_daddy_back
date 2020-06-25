const articleRouter = require('express').Router()

const Article = require('../models/article') 

articleRouter.get('/' , (req,res) =>{
    Article.find({}).then(result =>{
        res.json(result)
    })
})

articleRouter.get('/:id' ,(req,res) =>{
    Article.findById(req.params.id).then(result =>{
        res.json(result)
    })
})

articleRouter.post('/' ,(req,res) =>{
    const body = req.body
    const newArticle = new Article({
    
    title : body.title,
    summary : body.summary,
    tagline : body.tagline,
    ref_links : body.ref_links,
    comments : body.comments,
    report_val : body.report_val,
    contributor : body.contributor

})

    newArticle.save().then(result =>{
        res.json(result)
        console.log('article saved')
    })
    .catch(err =>{
        console.log(err)
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
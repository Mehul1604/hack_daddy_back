const articleRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Article = require('../models/article') 
const User = require('../models/user') 
const { update } = require('../models/article')

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
        res.json({
            newArticle : result,
            updatedUser : updated
        })
    })
})

articleRouter.put('/follow/:articleId' , async (req,res) =>{
    const body = req.body
    const token = getToken(req)
    const decodedToken = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedToken.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const UserWhoFollowed = await User.findById(decodedToken.id)
    const ArticleFollowed = await Article.findById(req.params.articleId)
    UserWhoFollowed.follow_id.push(ArticleFollowed._id)
    const updatedUser = await UserWhoFollowed.save()
    ArticleFollowed.followers = ArticleFollowed.followers + 1
    const updatedArticle = await ArticleFollowed.save()
    res.json({
        updatedArticle : updatedArticle,
        updatedUser : updatedUser
    })
})

articleRouter.delete('/:id' ,async (req,res) =>{

    const token = getToken(req)
    const decodedToken = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedToken.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const UserWhoDeleted = await User.findById(decodedToken.id)
    const ArticleToBeDeleted = await Article.findById(req.params.id)
    console.log(UserWhoDeleted.contributor_id)
    console.log('article to be deleted' , ArticleToBeDeleted)
     UserWhoDeleted.contributor_id = UserWhoDeleted.contributor_id.filter(id =>{
         return id.toString() !== (ArticleToBeDeleted._id).toString()
     })
    // console.log(typeof((UserWhoDeleted.contributor_id[2]).toString()))
    // console.log(typeof((ArticleToBeDeleted._id).toString()))
    // console.log(UserWhoDeleted.contributor_id[2].toString() === ArticleToBeDeleted._id.toString())

    const updatedUser = await UserWhoDeleted.save()
    await Article.findByIdAndDelete(ArticleToBeDeleted._id)

    //await Article.findByIdAndDelete(req.params.id)
    res.json({
        message : 'deleted article',
        updatedUser : updatedUser
    })
        
})

articleRouter.put('/reportValue/:id' , async (req,res) =>{
    const token = getToken(req)
    const decodedToken = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedToken.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const ArticleToBeUpdated = await Article.findById(req.params.id)
    const UserWhoReported = await User.findById(decodedToken.id)
    ArticleToBeUpdated.report_val = ArticleToBeUpdated.report_val + (UserWhoReported.rating * 0.25) //SOME MATHS HERE
    const updatedArticle = await ArticleToBeUpdated.save()
    return res.json(updatedArticle)

})

articleRouter.put('/comment/:id',async (req,res)=>{

    const token = getToken(req)
    const decodedToken = jwt.verify(token , process.env.SECRET_TOKEN)
    if(!token || !decodedToken.id){
        return res.status(401).json({
            error : 'token is missing or invalid'
        })
    }

    const commentBody = req.body.comment
    const UserWhoCommented = await User.findById(decodedToken.id)
    const newComment = {
        user : decodedToken.id,
        priority : (UserWhoCommented.rating * 0.10),
        body : commentBody,
        replies : []
    }
    Article.findByIdAndUpdate(req.params.id , {$push : {comments : newComment}} , {new : true}).then(result =>{
        console.log("comment added" , result)
        res.json(result)
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
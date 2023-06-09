const {post}= require('../db/sequelize')
const {ValidationError}= require('sequelize')
const {UniqueConstraintError}=require('sequelize')
const posts=require('../models/post')
const cors= require('cors')
const auth= require('../auth/isAuth')

module.exports= (server) => {
   server.post('/api/post/:id',auth,cors(), (req,res)=>{
  

    req.body.actif=0
    req.body.id_utilisateur= parseInt(req.params.id)

    var headers = req.headers;

    console.log(headers);
  
      post.create(req.body)
       .then(post =>{
           const message ='le post a bien ete ajouter.'
           res.json({message,data: post})
           console.log(req.body)
       }).catch(error => {
        if(error instanceof ValidationError ){
        return res.status(400).json({message: error.message,data: error})
       
       }
       if(error instanceof UniqueConstraintError){
        return res.status(400).json({message: error.message})
       }
       const message="le post n'a pas pue etre ajouter"
       res.status(500).json({message, data:error})
       console.log( req.session.user.id_utilisateur)
       
    })
    })
    
}
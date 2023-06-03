const {post}= require('../db/sequelize')
const {ValidationError}= require('sequelize')
const {UniqueConstraintError}=require('sequelize')
const posts=require('../models/post')
const cors= require('cors')


module.exports= (server) => {
   server.post('/api/post',cors(), (req,res)=>{
    posts.actif=1
    posts.titre=req.body.titre
    posts.contenu=req.body.contenu
    posts.adresse=req.body.adresse
    posts.longitude=req.body.longitude
    posts.latitude=req.body.latitude
    
    posts.lib_type=req.body.lib_type
    posts.lib_ville=req.body.lib_ville
    posts.id_utilisateur= req.session.user.id_utilisateur
    var headers = req.headers;

    console.log(headers);
  
      post.create(posts)
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
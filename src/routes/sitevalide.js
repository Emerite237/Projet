const { post }= require('../db/sequelize')
const {ValidationError}=require('sequelize')
const cors=require("cors")
module.exports =(app) =>{
    app.put('/api/post/sitevalide/:id', cors(),(req,res) =>
    {
        const id= req.params.id

        req.body.actif=1

        post.update(req.body,{
            where: {id_posts: id}

        })
        .then(_=>{
          return  post.findByPk(id).then(posts => {
                if(posts===null)
                {
                    
                    const message="le posts n'existe pas "
                        res.status(404).json({message}) 
                    
                }
                const message='le posts a bien ete modifie.'
                res.json({message,data:posts})
            })
        
            }).catch(error =>{
                const message="le posts n'a pas pue etre modifier,reesayer dans quelques instant"
                res.status(500).json({message,data: error}) 
            }).catch(error => {
                if(error instanceof ValidationError ){
                return res.status(400).json({message: error.message,data: error})
               }
               if(error instanceof UniqueConstraintError){
                return res.status(400).json({message: error.message})
               }

               const message="l'image n'a pas pue etre ajouter"
               res.status(500).json({message, data:error})
               
            })
        })
    }

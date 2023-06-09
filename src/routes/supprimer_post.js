const {post}= require('../db/sequelize');
const cors=require("cors")

module.exports = (app)=>{
    app.delete('/api/post/supprimer/:id', cors(),(req,res)=>{
        post.findByPk(req.params.id)
        .then(post => {
            if(post===null){
                
                const message="le posts n'existe pas, essayer un autre identifiant "
                return res.status(404).json({message}) 
            }
            const postsdelete=post;
            return post.destroy({
                where : id=post.id
            }).then(_ => {
                const message='le posts a ete supprimer'
                res.json( {message,data:postsdelete})
            }).catch(error =>{
                const message="le posts n'a pas pue etre supprimer,reesayer dans quelques instant"
                res.status(500).json({message,data:error}); 
        })
        })

    })
}
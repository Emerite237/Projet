const {vote}= require('../db/sequelize');
const cors=require("cors")

module.exports = (app)=>{
    app.delete('/api/vote/dislike/:id', cors(),(req,res)=>{
        vote.findAll({where: {id_post:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
        .then(votes => {
            if(votes===null){
                
                const message="le votes n'existe pas, essayer un autre identifiant "
                return res.status(404).json({message}) 
            }
            console .log(votes)
            const votesdelete=votes;
            return vote.destroy({
                where: {id_post:req.params.id, id_utilisateur: req.session.user.id_utilisateur}
            }).then(_ => {
                const message='le votes a ete supprimer'
                res.json( {message,data:votesdelete})
            }).catch(error =>{
                const message="le votes n'a pas pue etre supprimer,reesayer dans quelques instant"
                res.status(500).json({message,data:error}); 
        })
        })

    })
}
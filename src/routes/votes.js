const { vote } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')

const auth = require('../auth/isAuth')

const voter=require('../models/vote')

module.exports = (app) => {

    app.get('/api/vote/like/:id', auth, (req, res) => {
        
       
     
           

                voter.id_post= parseInt(req.params.id)
               voter.id_utilisateur=req.session.user.id_utilisateur
               voter.vote=1,
               
                vote.create(voter).then(fav=>{
                    const message = `Votre vote a été ajouté avec succès`
                    res.status(200).json(fav)
                }).catch(error =>{
                    const message = `Impossible d'ajouter votre favori. Réessayez dans quelques instants.`
                    res.status(500).json({message, data:error})
                    console.log(error)
                })
        })
     app.delete('/api/vote/dislike/:id', auth, (req, res) => {
        
     vote.findAll({where: {id_post:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
     .then(vote => {
        if (vote) {
          return vote.destroy();
        } else {
          console.log("Vote not found");
        }
      }).then(() => {
        console.log("Vote deleted successfully");
      }).catch(error => {
        console.error(error);
      });
            })
    
        
              
                
     
/*
       
    app.get('/api/vote/dislike/:id', auth, (req, res) => {
        vote.findOne({where: {id_vote:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
        .then(votes => {
            if(votes===null){
                let vot = {
                    vote:-1,
                    id_vote:req.params.id,
                    id_utilisateur: req.session.user.id_utilisateur
                }
                vote.create(vot).then((fav)=>{
                    const message = `Votre vote a été ajouté avec succès`
                    res.status(200).json({message, data:fav})
                }).catch(error =>{
                    const message = `Impossible d'ajouter votre favori. Réessayez dans quelques instants.`
                    res.status(500).json({message, data:error})
                    console.log(error)
                })
            }
            if(votes.vote===1){
                let voter= {
                    vote:-1
                }
                vote.update(voter, {
                    where: { id_vote: votes.id_vote }
                }).then(()=>{
                    const message = `votre vote a bien été mis à jour.`
                    res.status(200).json({message})
                }).catch((error)=>{
                    const message = `une érreur s'est produite lors de la mise à jour de votre vote.`
                    res.status(200).json({message, data:error})
                })
            }
            vote.destroy({
                where: { id_vote: votes.id_vote }
            })
            .then(_ => {
                const message = `votre vote a bien été supprimé.`
                res.status(200).json({message})
            })
            .catch(error => {
                const message = `Le pokémon n'a pas pu être supprimé. Réessayez dans quelques instants.`
                res.status(500).json({message, data: error})
            })
        })    
        .catch(error => {
            const message = `La liste des votes n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({message, data:error})
            console.log(error)
        })
    })

    app.get('/api/vote/:id', auth, (req, res) => {
        vote.findOne({where: {id_vote:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
        .then(votes => {
            const message = `votre vote a bien été recupéré`
            res.status(500).json({message, data:votes})
        })    
        .catch(error => {
            const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({message, data:error})
            console.log(error)
        })
    })*/

    app.get('/api/vote/like/count/:id', auth, (req, res) => {
        vote.findAll({attributes: [
            'vote',
            [sequelize.fn('COUNT', sequelize.col('vote')), 'n_vote']
        ],
        where: {id_vote:req.params.id, vote:1}})
        .then(votes => {
            const message = `votre vote a bien été recupéré`
            res.status(500).json({message, data:votes})
        })    
        .catch(error => {
            const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({message, data:error})
            console.log(error)
        })
    })

    app.get('/api/vote/dislike/count/:id', auth, (req, res) => {
        vote.findAll({attributes: [
            'vote',
            [sequelize.fn('COUNT', sequelize.col('vote')), 'n_vote']
        ],
        where: {id_vote:req.params.id, vote:-1}})
        .then(votes => {
            const message = `votre vote a bien été recupéré`
            res.status(500).json({message, data:votes})
        })    
        .catch(error => {
            const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({message, data:error})
            console.log(error)
        })
    })

    app.get('/api/vote/likes',auth, (req, res) => {
        vote.findAll({
        include:[{
            model:type,
            as:'type_vote',
            attributes:['lib_type']
        },
        {
            model:ville,
            as:'ville_vote',
            attributes:['lib_ville']
        },
        {
            model:utilisateur,
            as:'utilisateur_vote',
            attributes:['nom','prenom']
        },
        {
            model:vote,
            as:'vote_vote',
            where:{id_utilisateur:req.session.user.id_utilisateur, vote: 1}
        }],
        where: {actif:1}
        })
        .then(votes => {
            const message = 'La liste de vos like a bien été récupérée.'
            res.json({ message, data: votes })
        })
        .catch(error => {
            const message = `La liste des likes n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({message, data:error})
            console.log(error)
        })})}

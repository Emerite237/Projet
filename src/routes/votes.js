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


        app.get('/api/vote/like/count/:id', auth, (req, res) => {

            id=req.params.id
          return    vote.findAndCountAll(
            {
                where: { id_post:id}
            }
          )
            .then(  ({count,rows}) => {
                const message = `votre vote a bien été recupéré`
                res.status(500).json(count)
            })   
            .catch(error => {
                const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
                res.status(500).json({message, data:error})
                console.log(error)
            })
        })
    
        
              
    }
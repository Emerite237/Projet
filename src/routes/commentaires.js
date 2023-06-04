const {commentaire} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
const {posts} = require('../db/sequelize')
const auth = require('../auth/isAuth')

const {ValidationError}= require('sequelize')
const {UniqueConstraintError}=require('sequelize')

module.exports = (app) => {
  app.post('/api/commentaire/nouveau', auth, (req, res) => {
    req.body.id_utilisateur=req.session.user.id_utilisateur
    req.body.date_com = Date.now()
    commentaire.create(req.body)
      .then(commentaires => {
        const message = 'Le commentaire a bien été créé'
        res.json( commentaires )
      })
      .catch(error => {
        if(error instanceof ValidationError){
            return res.status(400).json({message: error.message, data: error})
        }
        const message = `Une erreur s'est produite lors de la création de votre commentaire`
        res.status(500).json({message, data: error})
      })
  })

  app.get('/api/commentaire/:id_post', auth, (req, res) => {
    commentaire.findAll(
      
      
      {
        include:[{
            model:utilisateur,
            as:'utilisateur',
            attributes:['nom']

        }],
        
        where: {id_post:req.params.id_post}})
       .then(commentaires => {
         const message = 'La liste des commentaires a bien été récupérée.'
         res.json({ message, data: commentaires })
       }) 
       .catch(error => {
         const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })

   app.get('/api/commentaire/:id_post/:id_parent', auth, (req, res) => {
    commentaire.findAll({where: {id_post:req.params.id_post, id_parent: req.params.id_parent}})
       .then(commentaires => {
         const message = 'La liste des commentaires a bien été récupérée.'
         res.json({ message, data: commentaires })
       }) 
       .catch(error => {
         const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })

   app.delete('/api/commentaire/supprimer/:id_commentaire', auth, (req, res) => {
    commentaire.destry({where: {id_commentaire:req.params.id_commentaire}})
       .then(commentaires => {
         const message = 'La liste des commentaires a bien été récupérée.'
         res.json({ message, data: commentaires })
       }) 
       .catch(error => {
         const message = `La liste des commentaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })
}
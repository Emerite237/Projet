const { post } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
const {favori} = require('../db/sequelize')
const auth = require('../auth/isAuth')

module.exports = (app) => {
  app.get('/api/favoris/:id', auth, (req, res) => {
    favori.findOne({where: {id_post:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
       .then(favoris => {
        if(favoris === null){
            let fav = {
                status:1,
                id_post:req.params.id,
                id_utilisateur: req.session.user.id_utilisateur
            }
            favori.create(fav).then((fav)=>{
                const message = `Votre favori a été ajouté avec succès`
                res.status(200).json({message, data:fav})
            }).catch(error =>{
                const message = `Impossible d'ajouter votre favori. Réessayez dans quelques instants.`
                res.status(500).json({message, data:error})
                console.log(error)
            })
          }else{
            favori.destroy({where: {id_favori:favoris.id_favori}}).then((favoris)=>{
                const message = `Votre favori a été supprimé avec succès`
                res.status(200).json({message, data:favoris})
            }).catch(error =>{
                const message = `Impossible de supprimer votre favori. Réessayez dans quelques instants.`
                res.status(500).json({message, data:error})
                console.log(error)
            })
          }
       }) 
       .catch(error => {
         const message = `Impossible d'éffectuer cette opération. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })

   app.get('/api/favori/:id', auth, (req, res) => {
    favori.findOne({where: {id_post:req.params.id, id_utilisateur: req.session.user.id_utilisateur}})
       .then(favoris => {
        if(favoris === null){
            const message = `favori`
            res.status(200).json({message, data:favoris})
        }else{
            const message = `Pas favori`
            res.status(500).json({message, data:favoris})
          }
       }) 
       .catch(error => {
         const message = `Impossible d'éffectuer cette opération. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })

   app.get('/api/favoris',auth, (req, res) => {
    post.findAll({
       include:[{
         model:type,
         as:'type_post',
         attributes:['lib_type']
       },
       {
         model:ville,
         as:'ville_post',
         attributes:['lib_ville']
       },
       {
         model:utilisateur,
         as:'utilisateur_post',
         attributes:['nom','prenom']
       },
       {
         model:favori,
         as:'favori_post',
         where:{id_utilisateur:req.session.user.id_utilisateur}
       }],
       where: {actif:1}
   })
       .then(posts => {
         const message = 'La liste de vos favoris a bien été récupérée.'
         res.json({ message, data: posts })
       })
       .catch(error => {
         const message = `La liste des favoris n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })
}
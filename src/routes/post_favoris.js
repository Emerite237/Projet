const { post } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
const {favori} = require('../db/sequelize')
const auth = require('../auth/isAuth')
module.exports = (app) => {
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
      
        res.json( posts)
      })
      .catch(error => {
        const message = `La liste des favoris n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })
}
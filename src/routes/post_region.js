const { post } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
module.exports = (app) => {
  app.get('/api/post_region/:id', (req, res) => {
   post.findAll({
      include:[{
        model:type,
        as:'type_post'
      },
      {
        model:ville,
        as:'ville_post',
        where:{id_region:req.params.id}
      },
      {
        model:utilisateur,
        as:'utilisateur_post'
      }],
      where: {actif:1}
  })
      .then(posts => {
        const message = 'La liste des posts a bien été récupérée.'
        res.json({ message, data: posts })
      })
      .catch(error => {
        const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })
}
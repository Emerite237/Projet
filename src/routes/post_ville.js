const { post } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
module.exports = (app) => {
  
  app.get('/api/ville/:lib', (req, res) => {

    post.findAll({
     
       where: {actif:1,
      lib_ville: req.params.lib}
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
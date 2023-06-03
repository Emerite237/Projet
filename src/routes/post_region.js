const { region } = require('../db/sequelize')
const {type} = require('../db/sequelize')
const {ville} = require('../db/sequelize')
const {utilisateur} = require('../db/sequelize')
module.exports = (app) => {
  app.get('/api/post_region', (req, res) => {
   region.findAll()
      .then(regions => {
        const message = 'La liste des regions a bien été récupérée.'
        res.json(regions)
      })
      .catch(error => {
        const message = `La liste des regions n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })
}
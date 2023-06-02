const {region} = require('../db/sequelize')
const {ville} = require('../db/sequelize')

module.exports = (app) => {
  app.get('/api/regions', (req, res) => {
   region.findAll()
      .then(regions => {
        const message = 'La liste des posts a bien été récupérée.'
        res.json({ message, data: regions })
      })
      .catch(error => {
        const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })

  app.get('/api/regions/:id', (req, res) => {
    ville.findAll({where: {id_region:req.params.id}})
       .then(villes => {
         const message = 'La liste des posts a bien été récupérée.'
         res.json({ message, data: villes })
       })
       .catch(error => {
         const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })
}
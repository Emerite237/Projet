const {categorie} = require('../db/sequelize')
const {type} = require('../db/sequelize')

module.exports = (app) => {
  app.get('/api/findall/categories', (req, res) => {
   categorie.findAll()
      .then(categories => {
        const message = 'La liste des posts a bien été récupérée.'
        res.json({ message, data: categories })
      })
      .catch(error => {
        const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
        console.log(error)
      })
  })


  app.get('/api/categories/:id', (req, res) => {
    type.findAll({where: {id_cat:req.params.id}})
       .then(types => {
         const message = 'La liste des posts a bien été récupérée.'
         res.json({ message, data: types })
       }) 
       .catch(error => {
         const message = `La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants.`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })
}
const {imagesuploads}= require('../db/sequelize')
const {Op}= require('sequelize')
       
module.exports= (server) => {
   server.get('/api/imagesuploads',(req,res)=>{
       if(req.query.lib_imagesuploads){
           const lib_imagesuploads=req.query.lib_imagesuploads
           return imagesuploads.findAll({
               where:{lib_imagesuploads
:{[Op.like]: `%${lib_imagesuploads}%`}
           },
           order:['lib_imagesuploads'],
           limit:4
       })
           .then(imagesuploads =>{
               const message= "l'element a bien ete retrouve"
               res.json({message,data:imagesuploads})
           })
       }


       imagesuploads.findAll()
       .then(imagesuploads =>{
           const message = `la liste des imagesuploadss a ete recupere.`
           res.json({message,data: imagesuploads}) 
       })
       .catch (error =>{
           const message="la liste des imagesuploads n'a pas ete recupere,reesayer dans quelques instant"
           res.status(500).json({message,data: error}) 
       })
   }) 
}
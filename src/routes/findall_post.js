 const {post}= require('../db/sequelize')
 const {type}=require('../db/sequelize')
 const {ville}=require('../db/sequelize')
 const {Op}= require('sequelize')
 const cors= require('cors')
 const auth= require('../auth/isAuth')


 

 module.exports= (server) => {
    server.get('/api/findall/post',/* auth,*/cors(),async(req,res,next)=>{
      /*  if(req.query.titre){
            const titre=req.query.titre
            return post.findAll({
                where:{titre:{[Op.like]: `${titre}%`}
            },
            order:['titre'],
            limit:4,
            raw:true
        })
            .then(post =>{
                const message= "l'element a bien ete retrouve"
                res.json(post)
                next()
                
            })
        */
try {

    var posts= await  post.findAll({
        include:[{
            model:type,
            as:'type_post',
            attributes:['lib_type']

        },{
            model:ville,
            as:'ville_post',
            attributes:['lib_ville']


        }
    ],

        
        where: {actif:1},
        order:['titre'],
         limit:5,
         raw:true
       }
        
       )
       
       res.json(posts) }
       
        catch (error ){
         
            res.status(500).json({message,data: error}) 
            console.log(error)}
        
    }) 
 }
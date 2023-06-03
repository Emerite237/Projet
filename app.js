const express = require('express')
const cookiesParser = require('cookie-parser')
const session = require('express-session')
const morgan =require('morgan')
const favicon=require('serve-favicon')
const bodyParser=require('body-parser')
const {sequelize} = require('./src/db/sequelize')
const ejs = require("ejs")
const path= require("path")
const sequelizeSession = require('connect-session-sequelize')(session.Store)

const cors =require('cors')


const app =express()
const port = 3000
const oneDay = 1000 * 60 * 60 * 24 
//synchronisation a la base de donnee embarque
sequelize.sync({force:false}).then( ()=>console.log('base de donnée pret'));

//session middleware

app.use("/public/data/uploads",express.static(path.join(__dirname,"/public/data/uploads")))
app.use(cookiesParser())
.use(session({
    secret:'key that will be secret',
    resave:false,
    saveUninitialized: false,
    store:new sequelizeSession({
        db:sequelize
    })
}))
.use(express.static(__dirname))
.use(favicon(__dirname + '/favicon.ico'))
.use(morgan('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended:true}))
.use(cors({ origin: '*',
methods:"GET,POST,HEAD,PUSH,DELETE,PATCH" }));

//ici, nous placerons nos futurs points de terminaison. 


// point de terminaison pour la recherche 

require('./src/routes/recherche')(app);         //    http://localhost:3000/api/search/:word

// point de terminaison des publication
require("./src/routes/findbypk")(app)        /* http://localhost:3000/api/post/?id=1   a la place du 1 tu peux mettre n'importe quel id    */ 

require('./src/routes/findall_post')(app)      /*   http://localhost:3000/api/findall/post   pour afficher toutes les publications 
                                                
                                                    http://localhost:3000/api/findall/post?titre=le titre du site rechercher    pour des recherches plus precise
                                               */
require('./src/routes/create_post')(app);    //    http://localhost:3000/api/post
require('./src/routes/update_post')(app);    //    http://localhost:3000/api/post/modifier/:id
require('./src/routes/supprimer_post')(app);    //    http://localhost:3000/api/post/supprimer/:id




require('./src/routes/post_ville')(app)               
require('./src/routes/favoris')(app)           
  //  http://localhost:3000/api/favoris
require('./src/routes/commentaires')(app)
//  http://localhost:3000/api/commentaire/nouveau  pour cree un commentaire
//  http://localhost:3000/api/commentaire/:id_post   pour retourner les commentaire  d'un post en fonction de l'id 

//  http://localhost:3000/api/commentaire/supprimer/:id_commentaire     pour supprimer un commentaire




require('./src/routes/villes')(app)          /*http://localhost:3000/api/regions  pour avoir la liste des region avec leur id 
                                            
                                             http://localhost:3000/api/ville pour avoir la liste des ville avec leur id  et la region assoscie

                                           */
//   point de terminaisons des likes et dislikes 

require('./src/routes/votes')(app)           /*   http://localhost:3000/api/vote/like/:id    cette route permet de faire un like , id est celui de la publication concerne

                                                  http://localhost:3000/api/vote/like/count/:id  cette route permet d'avoir le nombre de like d'une publication et id est celui de la publication 
*/ 
require('./src/routes/dislike')(app)           //http://localhost:3000/api/vote/dislike/:id
/*
http://localhost:3000/api/vote/like/:id   






http://localhost:3000/api/vote/like/count/:id

http://localhost:3000/api/vote/dislike/count/:id

http://localhost:3000/api/vote/likes







*/

// point de terminaison des images 


require('./src/routes/findall_image')(app)     //    http://localhost:3000/api/findall/img
require('./src/routes/create_image')(app);   //    http://localhost:3000/api/img
  // 
require('./src/routes/update_image')(app);
require('./src/routes/supprimer_image')(app);

require('./src/routes/findall_image_imageuploads')(app);  // afficher a la fois les images present dans le serveur et celle qui ont des url  http://localhost:3000/api/image_imagesuploads


require("./src/routes/uploade_image")(app);       //http://localhost:3000/api/upload
require("./src/routes/findbypk_images_uploads")(app);  // http://localhost:3000//api/findbypk/image_imagesuploads/id_post
require("./src/routes/findpk_images")(app);            // http://localhost:3000/api/img/id_post  pour avoir une image unique 

// point de terminaison des utilisateurs


require('./src/routes/utilisateurs')(app)      
 //    http://localhost:3000/api/login pour la connexion d'un utilisateur
require('./src/routes/utilisateurs')(app)     
//    http://localhost:3000 /api/register pour l'inscription d'un utilisateur
require('./src/routes/utilisateurs')(app);    
//   http://localhost:3000     /api/validation/:id/:token  pour verifier le token d'un utilisateur 
require('./src/routes/utilisateurs')(app)    
 //     http://localhost:3000 /api/userexist/:email pour verifier l'existence d'une adresse mail
require('./src/routes/utilisateurs')(app)  
  //        http://localhost:3000/api/passrecup    pour la mise ajour du mot de passe apres qu'on l'ai  recupere 
require('./src/routes/utilisateurs')(app)     
  //     http://localhost:3000/api/passupdate   modification du mot de passe 
require('./src/routes/utilisateurs')(app)       
//     http://localhost:3000/api/userupdate   mise a jour de l'utilisateur





//point de terminaisons sur les types,villes,regions et categorie
require('./src/routes/create_type')(app);       //    http://localhost:3000/api/type
require('./src/routes/create_categorie')(app);       //    http://localhost:3000/api/categorie
require('./src/routes/create_ville')(app);      //   http://localhost:3000/api/ville

require('./src/routes/create_region')(app);       //   http://localhost:3000/api/region

//

app.get('/',(req,res)=>{
  console.log(req.session)
  res.send('Hello session')
})

//On ajoute la gestion des erreurs 404
app.use(({res})=>{
  const message ='Impossible de trouver la ressource demandée! vous pouvez essayer une autre URL.'
  res.status(404).json({message})
})

app.listen(port,()=>console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
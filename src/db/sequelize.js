
const userModel = require('../models/utilisateur')
const postModel = require('../models/post')
const typeModel = require('../models/type')
const villeModel = require('../models/ville')
const regionModel = require('../models/region')
const categoriemodel=require('../models/categorie')
const verificationmodel=require('../models/verification')
var imageuploadsmodels=require('../models/imagesuploads')
var imagemodels =require('../models/images')

const commentaireModel = require('../models/commentaire')
const voteModel = require('../models/vote')
const favoriModel = require('../models/favori')


const { Sequelize, DataTypes } = require('sequelize')

  
const sequelize = new Sequelize('bd', 'root', '', {
  host: 'bd.sqlite',
  dialect: 'sqlite',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})

const imagesuploads=imageuploadsmodels(sequelize,DataTypes)
 const img=imagemodels(sequelize,DataTypes)
const post=postModel(sequelize,DataTypes)

const utilisateur = userModel(sequelize, DataTypes)
const type = typeModel(sequelize, DataTypes)
const ville = villeModel(sequelize, DataTypes)
const region = regionModel(sequelize, DataTypes)
const categorie=categoriemodel(sequelize,DataTypes)
const verification=verificationmodel(sequelize,DataTypes)  

const commentaire = commentaireModel(sequelize, DataTypes)
const vote = voteModel(sequelize, DataTypes)

const favori = favoriModel(sequelize, DataTypes)
  

const initDb = () => {
  return sequelize.sync({force: true}).then(_ => {
    console.log('La base de donnée a bien été initialisée !')
  })
}
  

// Type foreign Key to posts table
type.hasMany(post,{
  foreignKey:'id_type',
  as: 'type_post'
})
post.belongsTo(type,{
  foreignKey: 'id_type',
  as: 'type_post'
})

//ville foreign Key to posts table
ville.hasMany(post,{
  foreignKey:'id_ville',
  as: 'ville_post'
})
post.belongsTo(ville,{
  foreignKey: 'id_ville',
  as: 'ville_post'
})

//utilisateurs foreign Key to posts table
utilisateur.hasMany(post,{
  foreignKey:'id_utilisateur',
  as: 'utilisateur_post'
})
post.belongsTo(utilisateur,{
  foreignKey: 'id_utilisateur',
  as: 'utilisateur_post'
})

// Region foreign Key to villes table
region.hasMany(ville,{
  foreignKey:'id_region',
  as: 'region'
})
ville.belongsTo(region,{
  foreignKey: 'id_region',
  as: 'region'
})


// Categorie foreign Key on Types table
categorie.hasMany(type,{
  foreignKey:'id_cat',
  as: 'categories'
})
type.belongsTo(categorie,{
  foreignKey: 'id_cat',
  as: 'categories'
})


utilisateur.hasMany(verification,{
  foreignKey: 'id_utilisateur'
})

verification.belongsTo(utilisateur,{
  foreignKey: 'id_utilisateur'
})

// favori foreins keys 

post.hasMany(favori,{
  foreignKey:'id_post',
})
favori.belongsTo(post,{
  foreignKey: 'id_post',
})


utilisateur.hasMany(favori,{
  foreignKey: 'id_utilisateur'
})

favori.belongsTo(utilisateur,{
  foreignKey: 'id_utilisateur'
})

// vote foreign keys 

post.hasMany(vote,{
  foreignKey:'id_post',
})
vote.belongsTo(post,{
  foreignKey: 'id_post',
})


utilisateur.hasMany(vote,{
  foreignKey: 'id_utilisateur'
})

vote.belongsTo(utilisateur,{
  foreignKey: 'id_utilisateur'
})

module.exports = { 
 sequelize, utilisateur, post, img, type, ville, region, categorie, commentaire,vote, verification, favori,imagesuploads
}
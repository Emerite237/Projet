//const { Types } = require("mariadb")

const validetype=['parcs','zoo','lac','grotte','plage','montagne']

const valideregion=['NORD','SUD','EST','OUEST','CENTRE','SUD-OUEST','EXTREME-NORD','ADAMAOUA','LITTORAL','NORD-OUEST',]



module.exports = (sequelize,DataTypes)=> {

    return sequelize.define('post',
    {
        id_posts:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        titre:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
            validate:{
                notEmpty:{msg:'le titre est obligatoire'},
                notNull:{msg: 'cette propriete est requise'}
            }
        },
        contenu:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:{msg:'le contenu est obligatoire'},
                notNull:{msg: 'cette propriete est requise'}
            }
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull:false,
            validate: {
                isFloat: {msg:'la latitude est un reel'},
                notNull:{msg:'cette propriete est requise '},  max:{
                    args:[2000],
                    msg:'votre latitude ets trop grande,veuiller la reduire'
                },
                min:{
                    args:[0],
                    msg:"votre latitude ets trop petite,veuiller l'augmenter"
                }
            }
        },
        longitude:{
            type: DataTypes.DOUBLE,
            allowNull:false,
            validate: {
                isFloat: {msg:'la longitude est un reel'},
                notNull:{msg:'cette propriete est requise '},
                max:{
                    args:[2000],
                    msg:'votre longitude ets trop grande,veuiller la reduire'
                },
                min:{
                    args:[0],
                    msg:"votre longitude ets trop petite,veuiller l'augmenter"
                }
            }

        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:{msg:`L'adress est obligatoire'`},
                notNull:{msg: 'cette propriete est requise'}
            }
        },
        actif:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
            validate: {
              
                notNull:{msg:'cette propriete est requise '}
            }

        },
        lib_type: {
            type: DataTypes.STRING,
            allowNull: false,
           
            validate:{

                typevalide(value){
                    if(!validetype.includes(value)){
                        throw new console.error( "le type de tourisme renseigner n'existe pas");
                    }
                },
                notEmpty:{msg:'le type est obligatoire'},
                notNull:{msg: 'ce  type propriete est requise'},

            }
        },
        lib_ville:{
            type: DataTypes.STRING,
            allowNull: false,
           
            validate:{
              
                notEmpty:{msg:'la ville est obligatoire'},
                notNull:{msg: ' cette ville propriete est requise'}
            }
        },
         lib_region:{
            type: DataTypes.STRING,
            allowNull: false,
           
            validate:{
               regionvalide(value){
                    if(!valideregion.includes(value)){
                        throw new console.error( "le type de tourisme renseigner n'existe pas");
                    }
                },
              
                notEmpty:{msg:'la region est obligatoire'},
                notNull:{msg: ' cette region est une  propriete  requise'}
            }
        },
        id_utilisateur:{
            type: DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isInt: {msg:'id  est un  entier'},
                notNull:{msg:'cette propriete est requise '}
            }

        },
    },
    {
        timestamps:true,
        createdAt:'date_post',
        updatedAt: false
    }
    )
   
}
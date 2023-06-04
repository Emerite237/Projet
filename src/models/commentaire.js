
module.exports = (sequelize,DataTypes)=> {

    return sequelize.define('commentaire',
    {
        id_com:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        commentaire:{
            type: DataTypes.TEXT,
            allowNull: false,
           
            validate:{
                notEmpty:{msg:" il s'sagit d'une chaine de charactere  obligatoire"},
                notNull:{msg: 'cette propriete est requise'}
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
        id_post:{
            type: DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isInt: {msg:'id  est un  entier'},
                notNull:{msg:'cette propriete est requise '}
            }
        },
      /*  id_parents:{
            type: DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isInt: {msg:'id  est un  entier'},
                notNull:{msg:'cette propriete est requise '}
            }
        }*/
    },
    {
        timestamps:true,
        createdAt:'date_com',
        updatedAt: false
    })
}
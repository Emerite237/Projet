
module.exports = (sequelize,DataTypes)=> {

    return sequelize.define('favori',
    { 
        id_favori:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
              notEmpty: {msg: 'Le vote ne doit pas être vide'},
              notNull: {msg: 'Le vote est une propriété requise'}
            }
          },
          id_post: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
              isInt: {msg: `L'article à voter est obligatoire`},
              notNull: {msg: `L'article à voter est obligatoire`},
            }
          },
          id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
              isInt: {msg: 'Vous devez être connecté(e) pour effectuer un vote'},
              notNull: {msg: 'Vous devez être connecté(e) pour effectuer un vote'},
            }
          }
        }, {
          timestamps: true,
          createdAt: 'date_ajout',
          updatedAt: false
        })
}
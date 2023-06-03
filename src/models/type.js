module.exports = (sequelize, DataTypes) => {
    return sequelize.define('type', {
      id_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lib_type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:{
          msg:'ce type est deja enregistrer'
        },
        validate: {
          notEmpty: {msg: 'Le libélé du type ne doit pas être vide'},
          notNull: {msg: 'Le libelé du type est une propriété requise'}
        }
      },
      lib_cat: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:{
          msg:'ce type est deja enregistrer'
        },
        validate: {
          notEmpty: {msg: 'Le libélé du type ne doit pas être vide'},
          notNull: {msg: 'Le libelé du type est une propriété requise'}
        }
      }
    }, {
      timestamps: true,
      createdAt: false,
      updatedAt: false
    })
  }
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ville', {
      id_ville: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lib_ville: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: 'Le libelé de la ville ne doit pas être vide'},
          notNull: {msg: 'Le libelé de la ville est une propriété requise'}
        }
      },
    
      Lib_region: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {msg: 'La région ne doit pas être vide'},
          notNull: {msg: 'La région est une propriété requise'}
        }
      }
    }, {
      timestamps: true,
      createdAt: false,
      updatedAt: false
    })
  }
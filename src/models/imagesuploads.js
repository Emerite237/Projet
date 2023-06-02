
module.exports = (sequelize,DataTypes)=> {

    return sequelize.define('imageuploads',
    {
         
        
        id_imageupload:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_post: {
            type: DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isInt: {msg:'id  est un  entier'},
                notNull:{msg:'cette propriete est requise '}
            }
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: {msg: 'Le nom ne doit pas être vide'},
              notNull: {msg: 'Le nom est une propriété requise'}
            }},
    path:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique:{
           msg: 'ce texte est deja pris' 
        },
        validate:{
           isUrl:{msg:" il s'sagit d'une chaine de charactere  obligatoire"},
            notNull:{msg: 'cette propriete est requise'}
        },
    },
     

    
    
    
 
   
   

},
{
    timestamps:true,
    createdAt:'date_img',
    updatedAt:false
}
    )}
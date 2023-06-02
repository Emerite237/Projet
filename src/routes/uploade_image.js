const {imagesuploads}= require('../db/sequelize')
const {post}= require('../db/sequelize')
const {ValidationError}= require('sequelize')
const {UniqueConstraintError}=require('sequelize')
const image=require("../models/imagesuploads")
const path= require("path")
const multer =require("multer");



const uploadDir = path.join(__dirname, './public/data');
//const imagePath = path.join(uploadDir, 'uploads', `${filename}.jpg`);


const  MIME_TYPES={
  "image/jpg" : "jpg",
  "image/jpeg":"jpg",
  "image/gif":"gif",
  "image/png": "png",
  "image/bmp":"bmp"
}


const storage =multer.diskStorage({
  destination : (req,file,cb)=>
  {
     cb(null,"./public/data/uploads/")
  },
  filename : (req,file,cb)=>{
    const name=file.originalname.split(" ").join("_")
    const extention= MIME_TYPES[file.mimetype]

    

     cb(null, name+ "_"+Date.now()+ "."+extention);
  }
})


 const upload= multer({storage:storage,
  
   


  }
  )

module.exports= (server) => {
  var c=10
  server.post('/api/upload',upload.array('image'),async (req,res)=>{
    //const extention= MIME_TYPES[file.mimetype]

     var c=  await post.count();

     c=c+1;
    console.log(c)
    
     
      image.id_posts=parseInt(c)
      var paths = req.files.map(file => file.path);
      var noms = req.files.map(file => file.filename);

      
var newpaths =  await paths.map(function(path) {
  return path.replace(/\\/g, "/");
})

var files= req.files.map(file=>({path:file.path.replace(/\\/g, "/"),id_post:c,nom:file.filename}));
      console.log(paths)
      console.log(noms)
      console.log(files)
     await imagesuploads.bulkCreate(files)
      
    
     //req.files.forEach(function(file) {
     // var imagePath = path.join(uploadDir, 'uploads', `${file.filename}`+`.`+extention);

        
        res.send({message:" image(s) a(ont) ete upload"})
    })

    

     
  }
  
  

    
/*


exports.index= function(req,res){
    message=''
    if(req.method=="img"){
        var img= req.body;

       if(!req.files)
       return res.status(400).send("il ny'a pas de fichier a envoye")


       var file= req.file.uploaded_image;

       var img_name = file.name;

       if(file.mimetype=="image/jpeg" || file.mimetype=="image/png" || file.mimetype== "image/gif" ){
         file.nv ('public/data/uploads/'+ file.name,)
       }
    }
}*/
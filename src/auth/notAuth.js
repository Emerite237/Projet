module.exports= (req,res,next)=>{
    if(!req.session.user){
        next()
    }else{
        res.status(400).send("Vous devez être déconnecté pour acceder à ce service")
    }
}
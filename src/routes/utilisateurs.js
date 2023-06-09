const { utilisateur } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const {verification} = require('../db/sequelize')
const {v4: uuidv4} = require('uuid')
require('dotenv').config()
const notAuth = require('../auth/notAuth')
const Auth = require('../auth/isAuth')
const {ValidationError}= require('sequelize')
  
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
})  

module.exports = (app) => {

// connexion de l'utilisateur

  app.post('/api/login', async(req, res) => {
    utilisateur.findOne({
      where:{
        email:req.body.email
      }
    }).then(utilisateur => {
        if(utilisateur === null){
          const message = `email ou mot de passe incorrect`
          return res.status(404).json({message})
        }
        bcrypt.compare(req.body.pass, utilisateur.pass)
        .then(valid=>{
          if(!valid){
            const message = `Email ou mot de passe incorrect`;
            return res.status(404).json({message})
          }
          if(utilisateur.verifier==false){
            const token = uuidv4()
            let userverfification = {
              token: token,
              id_utilisateur: utilisateur.id_utilisateur,
              date_expiration: Date.now() + 21600000
            }
            return verification.create(userverfification).then(verification =>{
          
              // Envoi du mail au nouvel utilisateur
              if(verification === null){
                const message = `Erreur lors de la sauvegarde du token`
                res.status(500).json({message, data: error})
              }
              const currentUrl = "http://localhost:3000/api"  
              const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: utilisateur.email,
                subject: "Vérification de votre adresse mail",
                html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
                <p> Lien de vérification <b> expire dans 1h </b>.</p>
                <p>appuyez <a href='${currentUrl + "/validation/" + utilisateur.id_utilisateur + "/" + token}'>ici </a> pour verifier</p>`
              }
              transporter.sendMail(mailOptions).then(()=>{

                console.log('Lien de vérification envoyé avec succès')
                const message = `Votre adresse mail doit être vérifié pour terminer votre inscription </br> Un lien d'activativation vous a été envoyé dans votre boite mail`
                res.status(500).json(utilisateur)
                
              }).catch((error)=>{

                console.log(error)
                const message = `Erreur lors de l'envoi du mail`
                res.status(500).json({message, data: error})

              })
            })  
        //res.status(200).json({message, data: utilisateur})
          return res.status(500).json({message})
          }
          const message = 'One user found'
          req.session.user=utilisateur
          return res.json({message, data:utilisateur})
        })
      })
      .catch(error => {
        const message = `L'utilisateur n'a pas pu être récupéré. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
        console.log(error)
      })
  })


  // inscription d'un utilisateur

  app.post('/api/register', async(req, res) => {
    if(req.body.pass){
      const salt = await bcrypt.genSalt(10)
      newPass=await bcrypt.hash(req.body.pass, salt)
      req.body.pass = newPass
    }
    
    req.body.role = "utilisateur"
    req.body.verifier = 0

    //creation du nouvel utilisateur
    
    utilisateur.create(req.body)
      .then(utilisateur => {

        // remplissage de la table de vérification

        const token = uuidv4()
        let userverfification = {
          token: token,
          id_utilisateur: utilisateur.id_utilisateur,
          date_expiration: Date.now() + 21600000
        }
        return verification.create(userverfification).then(verification =>{
      
          // Envoi du mail au nouvel utilisateur
          if(verification === null){
            const message = `Erreur lors de la sauvegarde du token`
            res.status(500).json({message, data: error})
          }
          const currentUrl = "http://localhost:3000/api"  
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: utilisateur.email,
            subject: "Vérification de votre adresse mail",
            html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
            <p> Lien de vérification <b> expire dans 1h </b>.</p>
            <p>appuyez <a href='${currentUrl + "/validation/" + utilisateur.id_utilisateur + "/" + token}'>ici </a> pour verifier</p>`
          }
          transporter.sendMail(mailOptions).then(()=>{

            console.log('Lien de vérification envoyé avec succès')
            const message = 'Lien de vérification envoyé avec succès'
            res.status(200).json({message, data: utilisateur})
            
          }).catch((error)=>{

            console.log(error)
            const message = `Erreur lors de l'envoi du mail`
            res.status(500).json({message, data: error})

          })
        })  
        //res.status(200).json({message, data: utilisateur})
      })
      .catch(error => {
        if(error instanceof ValidationError){
          return res.status(400).json({message: error.message, data: error})
        }
        const message = `L'utilisateur n'a pu être créé. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
        console.log(error)
      })
  })

  //vérification d'un utilisateur

  app.get('/api/validation/:id/:token', (req, res) => {
    verification.findOne({where: {id_utilisateur:req.params.id}})
       .then(verification => {
         if(verification.token === req.params.token){

          // on vérifie si la date du token est valide

            if(verification.date_expiration > Date.now()){

              // mise à jour du status de l'utilisateur

              let user = {
                verifier: 1
              }
              utilisateur.update(user, {
                where: { id_utilisateur: req.params.id }
              }).then(()=>{

                // suppression du token de vérification de la table token

                verification.destroy({
                  where: { id_utilisateur: req.params.id }
                }).then(()=>{

                  const message = `Votre vérification a été effectué avec succès`
                  res.status(200).json({ message, data: verification })
                  req.session.user=utilisateur

                })
                .catch(()=>{
                  const message = `Le token n'a pas pu être supprimer désolé`
                  res.status(500).json({ message, data: verification })
                })
              })
              .catch(()=>{
                const message = `Une érreur s'est produite lors de la mise à jour de votre profil`
                res.status(500).json({ message, data: verification })
              })
                
            }else{

              // Mise à jour du token de vérification

              let new_verif = {
              token : uuidv4(),
              date_creation:Date.now(),
              date_expiration:Date.now() + 4600000
              }
              verification.update(new_verif, {
                where: { id_utilisateur: req.params.id }
              }).then(()=>{
                
                const currentUrl = "http://localhost:3000/api"
                // Envoi du nouveau mail de vérification à utilisateur
                
                const mailOptions = {
                  from: process.env.AUTH_EMAIL,
                  to: utilisateur.email,
                  subject: "Vérification de votre adresse mail",
                  html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
                  <p> Lien de vérification <b> expire dans 1h </b>.</p>
                  <p>appuyez <a href='${currentUrl + "/validation/" + utilisateur.id_utilisateur + "/" + new_verif.token}'>ici </a> pour verifier</p>`
                }
                transporter.sendMail(mailOptions).then(()=>{
                  
                  message=`Désolé votre token a expiré un nouveau mail vous a été envoyé`
                  res.status(500).json({message, data:error})

                }).catch((error)=>{
                  console.log(error)
                  const message = `Erreur lors de l'envoi du mail`
                  res.status(500).json({message, data: error})
                })

              })

              // Message de réponse 
             }

         }else{
            message=`Désolé votre Token de vérification est incorrect`
            res.status(500).json({message})
         }
       })
       .catch(error => {
         const message = `Nous n'arrivons pas à acceder au token désolé`
         res.status(500).json({message, data:error})
         console.log(error)
       })
   })

  //vérification de l'existence d'une adresse mail

  app.post('/api/userexist/:email', notAuth, async(req, res) => {
    utilisateur.findOne({
      where:{
        email:req.params.email
      }
    }).then(utilisateur => {
        if(utilisateur===null){
            message = 0
            res.status(200).json({message})
        }else{
            message = 1
            res.status(500).json({message})
        }
      })
      .catch(error => {
        const message = `L'utilisateur n'a pas pu être récupéré. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
        console.log(error)
      })
  })

  //Deconnexion de l'utilisateur

  app.get('/api/deconnexion', Auth, (req, res) => {
    req.session.destroy()
    const message = `vous avez été déconnecté avec succès`
    res.status(200).json({message})
  })

  // Recupération du mot de passe utilisateur

  app.post('/api/recuperation/:email', notAuth, async(req, res) => {
    utilisateur.findOne({
      where:{
        email:req.body.email
      }
    }).then(utilisateur => {
        if(utilisateur === null){
          const message = `email incorrecte`
          return res.status(404).json({message})
        }
        if(utilisateur.verifier===true){
        const message = `Votre adresse mail doit être vérifié pour terminer votre inscription </br> Un lien d'activativation vous sera envoyé dans votre boite mail`;
        const token = uuidv4()
        let userverfification = {
          token: token,
          id_utilisateur: utilisateur.id_utilisateur,
          date_expiration: Date.now() + 21600000
        }
        return verification.create(userverfification).then(verification =>{
      
          // Envoi du mail au nouvel utilisateur
          if(verification === null){
            const message = `Erreur lors de la sauvegarde du token`
            res.status(500).json({message, data: error})
          }
          const currentUrl = "http://localhost:3000/api"  
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: utilisateur.email,
            subject: "Vérification de votre adresse mail",
            html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
            <p> Lien de vérification <b> expire dans 1h </b>.</p>
            <p>appuyez <a href='${currentUrl + "/recuperation/" + utilisateur.id_utilisateur + "/" + token}'>ici </a> pour verifier</p>`
          }
          transporter.sendMail(mailOptions).then(()=>{

            console.log('Lien de vérification envoyé avec succès')
            const message = 'Lien de vérification envoyé avec succès'
            res.status(200).json({message, data: utilisateur})
            
          }).catch((error)=>{

            console.log(error)
            const message = `Erreur lors de l'envoi du mail`
            res.status(500).json({message, data: error})

          })
        })  
        //res.status(200).json({message, data: utilisateur})
          return res.status(500).json({message})
        }
        })
      
      .catch(error => {
        const message = `L'utilisateur n'a pas pu être récupéré. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
        console.log(error)
      })
    })

    //vérification du lien de récupération

    app.get('/api/recuperation/:id/:token',notAuth ,(req, res) => {
        verification.findOne({where: {id_utilisateur:req.params.id}})
           .then(verification => {
             if(verification.token === req.params.token){
    
              // on vérifie si la date du token est valide
    
                if(verification.date_expiration > Date.now()){
    
                      // suppression du token de vérification de la table token

                    verification.destroy({
                        where: { id_utilisateur: req.params.id }
                    }).then(()=>{
                        
                        utilisateur.findOne({where:{id_utilisateur:req.params.id}}).then(utilisateur=>{
                            const message = `Votre vérification a été effectué avec succès`
                            res.status(200).json({ message, data: verification })
                            req.session.user=utilisateur
                        }).catch(_=>{
                            const message = `Erreur de récupération des informations de l'utilisateur`
                            res.status(500).json({ message })
                        })
                        
    
                    })
                    .catch(()=>{
                        const message = `Le token n'a pas pu être supprimer désolé`
                        res.status(500).json({ message, data: verification })
                    })
    
                }else{
    
                  // Mise à jour du token de vérification
    
                  let new_verif = {
                  token : uuidv4(),
                  date_creation:Date.now(),
                  date_expiration:Date.now() + 4600000
                  }
                  verification.update(new_verif, {
                    where: { id_utilisateur: req.params.id }
                  }).then(()=>{
                    
                    const currentUrl = "http://localhost:3000/api"
                    // Envoi du nouveau mail de recupération à utilisateur
                    
                    const mailOptions = {
                      from: process.env.AUTH_EMAIL,
                      to: utilisateur.email,
                      subject: "Vérification de votre adresse mail",
                      html: `<p>Vérifiez votre mail pour completer votre enregistremt.</p>
                      <p> Lien de vérification <b> expire dans 1h </b>.</p>
                      <p>appuyez <a href='${currentUrl + "/recuperation/" + utilisateur.id_utilisateur + "/" + new_verif.token}'>ici </a> pour verifier</p>`
                    }
                    transporter.sendMail(mailOptions).then(()=>{
                      
                      message=`Désolé votre token a expiré un nouveau mail vous a été envoyé`
                      res.status(500).json({message, data:error})
    
                    }).catch((error)=>{
                      console.log(error)
                      const message = `Erreur lors de l'envoi du mail`
                      res.status(500).json({message, data: error})
                    })
    
                  })
    
                  // Message de réponse 
                 }
    
             }else{
                message=`Désolé votre Token de vérification est incorrect`
                res.status(500).json({message})
             }
           })
           .catch(error => {
             const message = `Nous n'arrivons pas à acceder au token désolé`
             res.status(500).json({message, data:error})
             console.log(error)
           })
       })


    //mise à jour du mot de passe après recupération

  app.put('/api/passrecup',Auth, async (req, res) => {
    //pass
    if(req.body.pass){
        const salt = await bcrypt.genSalt(10)
        newPass=await bcrypt.hash(req.body.pass, salt)
        req.body.pass=newPass
    }
    utilisateur.update(req.body.pass, {
        where: { id_utilisateur: req.session.user.id_utilisateur }
      }).then(utilisateur=>{
        const message = `Votre mot de passe a été modifié avec succès`
        res.status(200).json({message, data:utilisateur})
      }).catch(error=>{
        const message = `Erreur survenue lors de la mise à jour de votre mot de passe`
        res.status(500).json({message, data:error})
      })
   })

   // Modification du mot de passe utilisateur

   app.put('/api/passupdate', Auth, async(req, res) => {
    //oldpass
    //newpass
    if(req.body.newpass){
        const salt = await bcrypt.genSalt(10)
        newPass=await bcrypt.hash(req.body.newpass, salt)
    }
    utilisateur.findOne({
        where:{
          id_utilisateur:req.session.user.id_utilisateur
        }
      }).then(utilisateur => {
          if(utilisateur === null){
            const message = `Utilisateur inexistant`
            return res.status(404).json({message})
          }
          bcrypt.compare(req.body.oldpass, utilisateur.pass)
          .then(valid=>{
            if(!valid){
              const message = `Email ou mot de passe incorrect`;
              return res.status(404).json({message})
            }
            
            let passUpdate = {
                pass: newPass
            }
            utilisateur.update(passUpdate, {
                where: { id_utilisateur: req.session.user.id_utilisateur }
              }).then(utilisateur=>{
                const message = `Votre mot de passe a été modifié avec succès`
                res.status(200).json({message, data:utilisateur})
              }).catch(error=>{
                const message = `Erreur survenue lors de la mise à jour de votre mot de passe`
                res.status(500).json({message, data:error})
              })

          })
        })
        .catch(error => {
          const message = `L'utilisateur n'a pas pu être récupéré. Réessayez dans quelques instants.`
          res.status(500).json({message, data: error})
          console.log(error)
        })
   })

   // Mise à jour des informations utilisateur

   app.put('/api/userupdate', (req, res) => {
    utilisateur.update(req.body, {
        where: { id_utilisateur: req.session.user.id_utilisateur }
      })
      .then(_ => {
        
          const message = `Vos informations ont été mises à jour avec succès`
          res.json({message})
        
      })
      .catch(error => {
        if(error instanceof ValidationError){
          return res.status(400).json({message: error.message, data: error})
        }
          const message = `Erreur lors de la mise à jour de vos informations`
          res.status(500).json({message, data: error})
        })
   })
}
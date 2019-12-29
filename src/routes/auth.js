const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');
const token = require('../services/token')

// ingresar (login)
router.post('/', async (req, res) => {
  try{
    //  validar email con la base de datos
    let user = await Usuario.findOne({
      email: req.body.email,
      estado:1
    })
    if (!user) {
      return res.status(404).send({message:'Usuario o contraseña incorrectos'})
    }

    // validar la contraseña encriptada con la base de datos
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword){
      return res.status(404).send({message:'Usuario o contraseña incorrectos'})
    }
    
    // genrerar un token con una funcion del modelo user
    const generateJWT = await token.encode(user._id, user.rol, user.email,user.nombre)
    res.status(200).json({
      user,generateJWT
    })
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

module.exports = router
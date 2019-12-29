const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth')

// agregar
router.post('/',auth.verifyAdministrador ,async (req,res,next) => {
  try{
    // encriptación de contraseña
    const salt  = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)

    const usuario = new Usuario(req.body)
    await usuario.save()
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los elementos
router.get('/', auth.verifyAdministrador,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const usuario = await Usuario.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'email':new RegExp(valor,'i')}
      ]
    },{date:0}).sort({'date':-1})
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer un elemento
router.get('/:id', auth.verifyAdministrador, async (req,res,next) => {
  try{
    const usuario = await Usuario.findById(req.params.id);
    if(!usuario){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(usuario);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar
router.put('/:id', auth.verifyAdministrador,async (req,res,next) => {
  try{
    let pas = req.body.password
    console.log(req.body._id);
    
    const reg0 = await Usuario.findOne({_id:req.body._id})
    console.log(pas);
    
    if(pas != reg0.password){
      const salt  = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//eliminar
router.delete('/:id', auth.verifyAdministrador,async (req,res,next) => {
  try{
    const {id} = req.params;
    const usuario = await Usuario.findByIdAndDelete(id)
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//activar un elemento
router.get('/activate/:id',auth.verifyAdministrador, async (req,res,next) => {
  try{
    const usuario = await Usuario.findByIdAndUpdate(req.params.id,{estado:1})
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//desactivar un elemento
router.get('/deactivate/:id',auth.verifyAdministrador, async (req,res,next) => {
  try{
    const usuario = await Usuario.findByIdAndUpdate(req.params.id,{estado:0})
    res.status(200).json(usuario)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona')
const auth = require('../middlewares/auth')

// agregar
router.post('/',auth.verifyUsuario,async (req,res,next) => {
  try{
    const persona= new Persona(req.body)
    await persona.save()
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los elementos
router.get('/', auth.verifyUsuario,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const persona = await Persona.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'email':new RegExp(valor,'i')}
      ]
    },{date:0}).sort({'date':-1})
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los Clientes
router.get('/clientes', auth.verifyUsuario,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const persona = await Persona.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'email':new RegExp(valor,'i')}
      ],
      'tipo_persona':'Cliente'
    },{date:0}).sort({'date':-1})
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})


// leer todos los Proveedores
router.get('/Proveedores', auth.verifyUsuario,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const persona = await Persona.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'email':new RegExp(valor,'i')}
      ],
      'tipo_persona':'Proveedor'
    },{date:0}).sort({'date':-1})
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer un elemento
router.get('/:id', auth.verifyUsuario, async (req,res,next) => {
  try{
    const persona = await Persona.findById(req.params.id);
    if(!persona){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(persona);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar
router.put('/:id', auth.verifyUsuario,async (req,res,next) => {
  try{
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//eliminar
router.delete('/:id', auth.verifyUsuario,async (req,res,next) => {
  try{
    const {id} = req.params;
    const persona = await Persona.findByIdAndDelete(id)
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//activar un elemento
router.get('/activate/:id', auth.verifyUsuario,async (req,res,next) => {
  try{
    const persona = await Persona.findByIdAndUpdate(req.params.id,{estado:1})
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//desactivar un elemento
router.get('/deactivate/:id', auth.verifyUsuario,async (req,res,next) => {
  try{
    const persona = await Persona.findByIdAndUpdate(req.params.id,{estado:0})
    res.status(200).json(persona)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

module.exports = router;
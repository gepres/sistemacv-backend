const express = require('express');
const router = express.Router();
const Articulo = require('../models/Articulo')
const auth = require('../middlewares/auth')

// agregar
router.post('/', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const articulo = new Articulo(req.body)
    await articulo.save()
    res.status(200).json(articulo)
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
    const articulo = await Articulo.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'descripcion':new RegExp(valor,'i')}
      ]
    },{date:0}).populate('categoria',{nombre:1}).sort({'date':-1})

    res.status(200).json(articulo)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer un elemento
router.get('/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const articulo = await Articulo.findById(req.params.id).populate('categoria',{nombre:1});
    if(!articulo){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(articulo);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar
router.put('/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const articulo = await Articulo.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(articulo)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//eliminar
router.delete('/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const {id} = req.params;
    const articulo = await Articulo.findByIdAndDelete(id)
    res.status(200).json(articulo)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})


// consultar el codigo de barra
router.get('/query/Codigo', auth.verifyUsuario,async (req,res,next) => {
  try{
    const reg = await Articulo.findOne({codigo:req.query.codigo}).populate('categoria',{nombre:1});
    if(!reg){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(reg);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})


//activar un elemento
router.get('/activate/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const articulo = await Articulo.findByIdAndUpdate(req.params.id,{estado:1})
    res.status(200).json(articulo)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//desactivar un elemento
router.get('/deactivate/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const articulo = await Articulo.findByIdAndUpdate(req.params.id,{estado:0})
    res.status(200).json(articulo)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

module.exports = router;
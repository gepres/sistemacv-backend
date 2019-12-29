const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria')
const auth = require('../middlewares/auth')

// agregar
router.post('/', auth.verifyAlmacenero, async (req,res,next) => {
  try{
    const categoria = new Categoria(req.body)
    await categoria.save()
    res.status(200).json(categoria)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los elementos
router.get('/', auth.verifyAlmacenero, async (req,res,next) => {
  try{
    let valor = req.query.valor
    const categoria = await Categoria.find({
      $or:[
        {'nombre':new RegExp(valor,'i')},
        {'descripcion':new RegExp(valor,'i')}
      ]
    },{date:0}).sort({'date':-1})
    res.status(200).json(categoria)
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
    const categoria = await Categoria.findById(req.params.id);
    if(!categoria){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(categoria);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar
router.put('/:id', auth.verifyAlmacenero, async (req,res,next) => {
  try{
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(categoria)
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
    const categoria = await Categoria.findByIdAndDelete(id)
    res.status(200).json(categoria)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//activar un elemento
router.get('/activate/:id',auth.verifyAlmacenero, async (req,res,next) => {
  try{
    const categoria = await Categoria.findByIdAndUpdate(req.params.id,{estado:1})
    res.status(200).json(categoria)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//desactivar un elemento
router.get('/deactivate/:id', auth.verifyAlmacenero, async (req,res,next) => {
  try{
    const categoria = await Categoria.findByIdAndUpdate(req.params.id,{estado:0})
    res.status(200).json(categoria)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

module.exports = router;
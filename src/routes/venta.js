const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta')
const Articulo = require('../models/Articulo')
const auth = require('../middlewares/auth')


async function aumentarStock(idArticulo,cantidad){
  let {stock} = await Articulo.findOne({_id:idArticulo})
  let nStock = parseInt(stock) + parseInt(cantidad);
  const reg = await Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock})
}

async function disminuirStock(idArticulo,cantidad){
  let {stock} = await Articulo.findOne({_id:idArticulo})
  let nStock = parseInt(stock) - parseInt(cantidad);
  const reg = await Articulo.findByIdAndUpdate({_id:idArticulo},{stock:nStock})
}

// agregar
router.post('/',auth.verifyVendedor,async (req,res,next) => {
  try{
    const venta = new Venta(req.body)
    // actualizar stock
    let detalles = req.body.detalles;
    detalles.map(function(x){
      disminuirStock(x._id,x.cantidad)
    })

    await venta.save()
    res.status(200).json(venta)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los elementos
router.get('/', auth.verifyVendedor,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const venta = await Venta.find({
      $or:[
        {'num_comprobante':new RegExp(valor,'i')},
        {'serie_comprobante':new RegExp(valor,'i')}
      ]
    })
    .populate('usuario',{nombre:1})
    .populate('persona',{nombre:1,direccion:1,num_documento:1,telefono:1,email:1})
    .sort({'date':-1})
    res.status(200).json(venta)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer un elemento
router.get('/:id', auth.verifyVendedor,async (req,res,next) => {
  try{
    const venta = await (await Venta.findById(req.params.id))
    .populate('usuario',{nombre:1})
    .populate('persona',{nombre:1})
    if(!venta){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(venta);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar y remove 
//  no se puede modificar un venta o eliminarlo 


//activar un elemento
router.get('/activate/:id', auth.verifyVendedor,async (req,res,next) => {
  try{
    const venta = await Venta.findByIdAndUpdate(req.params.id,{estado:1})
     // actualizar stock
     let detalles = venta.detalles;
    detalles.map(function(x){
      disminuirStock(x._id,x.cantidad)
     })

    res.status(200).json(venta)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

//desactivar un elemento
router.get('/deactivate/:id', auth.verifyVendedor,async (req,res,next) => {
  try{
    const venta = await Venta.findByIdAndUpdate(req.params.id,{estado:0})
    // actualizar stock
    let detalles = venta.detalles;
    detalles.map(function(x){
      aumentarStock(x._id,x.cantidad)
     })

    res.status(200).json(venta)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// 
router.get('/grafico/12', auth.verifyUsuario, async (req,res,next) => {
  try {
    const reg= await Venta.aggregate(
      [
        {
          $group:{
            _id:{
              mes:{$month:"$date"},
              year:{$year: "$date"}
            },
            total:{$sum:"$total"},
            numero:{$sum:1}
          }
        },
        {
          $sort:{
            "_id.year":-1,"_id.mes":-1
          }
        }
      ]
    ).limit(12);
    
    res.status(200).json(reg);
  } catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    });
    next(e);
  }
})


// leer todos los elementos por fechas
router.get('/consultaFechas', auth.verifyUsuario,async (req,res,next) => {
  try{
    let start = req.query.start;
    let end = req.query.end;

    const ingreso = await Venta.find({"date":{"$gte": start, "$lt":end}})
    .populate('usuario',{nombre:1})
    .populate('persona',{nombre:1})
    .sort({'date':-1})
    res.status(200).json(ingreso)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})


module.exports = router;
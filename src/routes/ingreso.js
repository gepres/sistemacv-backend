const express = require('express');
const router = express.Router();
const Ingreso = require('../models/Ingreso')
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
router.post('/',auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const ingreso = new Ingreso(req.body)
    // actualizar stock
    let detalles = req.body.detalles;
    detalles.map(function(x){
      aumentarStock(x._id,x.cantidad)
    })

    await ingreso.save()
    res.status(200).json(ingreso)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// leer todos los elementos
router.get('/', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    let valor = req.query.valor
    const ingreso = await Ingreso.find({
      $or:[
        {'num_comprobante':new RegExp(valor,'i')},
        {'serie_comprobante':new RegExp(valor,'i')}
      ]
    })
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

// leer un elemento
router.get('/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const ingreso = await (await Ingreso.findById(req.params.id))
    .populate('usuario',{nombre:1})
    .populate('persona',{nombre:1})
    if(!ingreso){
      res.status(404).send({
        message:'El registro no existe'
      })
    }else{
      res.status(200).json(ingreso);
    }
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// actualizar y remove 
//  no se puede modificar un ingreso o eliminarlo 


//activar un elemento
router.get('/activate/:id', auth.verifyAlmacenero,async (req,res,next) => {
  try{
    const ingreso = await Ingreso.findByIdAndUpdate(req.params.id,{estado:1})
     // actualizar stock
     let detalles = ingreso.detalles;
    detalles.map(function(x){
      aumentarStock(x._id,x.cantidad)
     })

    res.status(200).json(ingreso)
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
    const ingreso = await Ingreso.findByIdAndUpdate(req.params.id,{estado:0})
    // actualizar stock
    let detalles = ingreso.detalles;
    detalles.map(function(x){
      disminuirStock(x._id,x.cantidad)
     })

    res.status(200).json(ingreso)
  }catch(e){
    res.status(500).send({
      message:'Ocurrió un error'
    })
    next(e)
  }
})

// graficos de los ultimos 12 meses
router.get('/grafico/12',auth.verifyUsuario, async (req,res,next) => {
  try {
    const reg= await Ingreso.aggregate(
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

    const ingreso = await Ingreso.find({"date":{"$gte": start, "$lt":end}})
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
const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const Ingreso = new Schema({
  usuario:{
    type:Schema.Types.ObjectId,
    ref:'usuario',
    required:true
  },
  persona:{
    type:Schema.Types.ObjectId,
    ref:'persona',
    required:true
  },
  tipo_comprobante:{
    type:String,
    maxlength:20,
    required:true
  },
  serie_comprobante:{
    type:String,
    maxlength:7
  },
  num_comprobante:{
    type:String,
    maxlength:10,
    required:true
  },
  impuesto:{
    type:Number,
    required:true
  },
  total:{
    type:Number,
    required:true
  },
  detalles:[{
    _id:{
      type:String,
      required:true
    },
    articulo:{
      type:String,
      required:true
    },
    cantidad:{
      type:Number,
      required:true
    },
    precio:{
      type:Number,
      required:true
    }
  }],
  estado:{
    type:Number,
    default:1
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('ingreso', Ingreso);
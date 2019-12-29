const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const Articulo = new Schema({
    categoria: {
      type: Schema.Types.ObjectId,
      ref:'categoria'
    },
    codigo: {
      type: String,
      maxlength:64
    },
    nombre: {
      type:String,
      maxlength:50,
      unique:true,
      required:true
    },
    descripcion: {
      type: String,
      maxlength:255
    },
    precio_venta:{
      type:Number,
      required:true
    },
    stock: {
      type:Number,
      required:true 
    },
    estado: {
      type: Number,
      default:1
    },
    date: {
      type: Date,
      default: Date.now
    },
  })
  
  module.exports = model('articulo', Articulo);
const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const Categoria = new Schema({
    nombre: {
      type: String,
      maxlength:50,
      unique:true,
      required: [true, 'Nombre es obligatorio']
    },
    descripcion: {
      type: String,
      maxlength:255
    },
    estado: {
      type: Number,
      default:1
    },
    date: {
      type: Date,
      default: Date.now
    }
  })
  
  module.exports = model('categoria', Categoria);
  
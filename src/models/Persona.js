const mongoose = require('mongoose');
const {
  Schema,
  model
} = mongoose;

const Persona = new Schema({
    tipo_persona:{
      type: String,
      maxlength:20,
      required:true
    },
    nombre:{
      type:String,
      maxlength:50,
      unique:true,
      required:true
    },
    tipo_documento:{
      type:String,
      maxlength:20
    },
    num_documento:{
      type:String,
      maxlength:20
    },
    direccion:{
      type:String,
      maxlength:70
    },
    telefono:{
      type:String,
      maxlength:20
    },
    email:{
      type:String,
      maxlength:64,
      unique:true,
    },
    estado:{
      type:Number,
      default:1
    },
    date: {
      type: Date,
      default: Date.now
    }
  })
  
  module.exports = model('persona', Persona);
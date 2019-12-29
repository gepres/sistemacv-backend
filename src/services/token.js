const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

async function checkToken(token){
  let __id = null;
  try {
    const {_id} = await jwt.decode(token);
    __id = _id;
  } catch (e) {
    return false
  }
  const user = await Usuario.findOne({_id:__id,estado:1})
  if(user){
    const token = jwt.sign({_id:_id},'clavesecreta',{expiresIn:'1d'})
    return {token,rol:user.rol}
  }else{
    false;
  }
}

module.exports = {
  encode: async (_id,rol,email,nombre) => {
    const token = jwt.sign({_id:_id, rol:rol,email:email,nombre:nombre},'clavesecreta',{expiresIn:'1d'});
    return token;
  },
  decode:async (token) => {
    try {
      const {_id} = await jwt.verify(token,'clavesecreta')
      const user = await Usuario.findOne({_id, estado:1})
      if(user){
        return user;
      }else{
        return false;
      }
    } catch (e) {
      const newToken = await checkToken(token)
      return newToken
    }
  }
}
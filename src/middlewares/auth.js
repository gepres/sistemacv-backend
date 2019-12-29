const tokenService = require('../services/token')

module.exports = {
  test:(req, res ,next) => {
    console.log(req.headers);
    console.log(req.headers.token);
    // next()
  },
  verifyUsuario: async (req, res ,next) => {
    if (!req.headers.token) {
      return res.status(404).send({message:'No Existe el token'})
    }
    const response = await tokenService.decode(req.headers.token)
    if(response.rol === 'Administrador'|| response.rol === 'Vendedor' || response.rol === 'Almacenero'){
      next()
    }else{
      return res.status(403).send({message:'Usuario no autorizado'})
    }
  },
  verifyAdministrador: async (req, res ,next) => {
    if (!req.headers.token) {
      return res.status(404).send({message:'No Existe el token'})
    }
    const response = await tokenService.decode(req.headers.token)
    if(response.rol === 'Administrador'){
      next()
    }else{
      return res.status(403).send({message:'Usuario no autorizado'})
    }
  },
  verifyAlmacenero: async (req, res ,next) => {
    if (!req.headers.token) {
      // console.log(req.headers.token);
      return res.status(404).send({message:'No Existe el token'})
    }
    
    const response = await tokenService.decode(req.headers.token)
    if(response.rol === 'Administrador'|| response.rol === 'Almacenero'){
      next()
    }else{
      return res.status(403).send({message:'Usuario no autorizado'})
    }
  },
  verifyVendedor: async (req, res ,next) => {
    if (!req.headers.token) {
      return res.status(404).send({message:'No Existe el token'})
    }
    const response = await tokenService.decode(req.headers.token)
    if(response.rol === 'Administrador'|| response.rol === 'Vendedor'){
      next()
    }else{
      return res.status(403).send({message:'Usuario no autorizado'})
    }
  }
}
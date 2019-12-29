const express =require('express')
const morgan = require('morgan');
const cors = require('cors')
const path = require('path')

// Initializations
const app = express();
require('./database');
app.use(cors())

// settings
app.set('port', process.env.PORT || 3000);


// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))


// routes
app.use('/api/categoria', require('./routes/categoria'))
app.use('/api/articulo', require('./routes/articulo'))
app.use('/api/usuario', require('./routes/usuario'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/persona', require('./routes/persona'))
app.use('/api/ingreso', require('./routes/ingreso'))
app.use('/api/venta', require('./routes/venta'))


// static files
app.use(express.static(path.join(__dirname, 'public')))
// app.get("/", function(req, res) {
//   res.send("Hola Mundo!");
// });


module.exports = app;
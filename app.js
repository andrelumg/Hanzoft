var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Aca creo una variable en donde indico la ruta que voy a usar para conectarme con mis modulos
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouterDoctores = require('./routes/apiDoctores');
var apiRouterUsuarios = require('./routes/apiUsuarios');
var apiRouterMascotas = require('./routes/apiMascotas');
var apiRouterClientes = require('./routes/apiClientes');
var apiRouterCitas = require('./routes/apiCitas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'public/views')))

// Aca se hace uso de la ruta que declaramos en la parte de arriba cuando declaramos las variables
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/doctores', apiRouterDoctores);
app.use('/api/usuarios', apiRouterUsuarios);
app.use('/api/mascotas', apiRouterMascotas);
app.use('/api/clientes', apiRouterClientes);
app.use('/api/citas', apiRouterCitas);

// catch 404 and forward to error handler, si no funciona arrojara ese error
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

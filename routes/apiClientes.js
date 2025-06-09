var express = require('express');
var router = express.Router();
// 1. Conectarme a la base de datos.
var conexionesDb = require('../db');


//obtener la lista de clientes
router.get('/', async function (peticion, respuesta) {
  //contolador
  //se hace un try catch para poder controlar los errores del programa
  try {
    // Aca estoy declarando la consulta
    const consulta = 'SELECT * FROM clientes'
    // Aca estoy generando la consulta
    // y me retornaria la consulta en un array
    const [filas] = await conexionesDb.query(consulta)
    // Retornar la lista de usuarios en formato JSON.
    respuesta.json(filas);
  } catch (error) {
    //Si no se ejecuta bien entonces, esto arroja un mensaje de error
    console.error('Error al consultar las mascotas', error)
    // El mensaje de error se generaria en un Json para presentarlo
    respuesta.status(500).json({
      error: 'Error al conectar con el servidor'
    })
  }

})

// Ruta GET para obtener los datos de una cliente por su ID
router.get('/:clienteId', async function (peticion, respuesta) {
  // Obtener el ID de la cliente desde los parámetros de la URL
  const clienteId = peticion.params.clienteId;

  // Manejo de errores con try...catch
  try {
    // Consulta SQL para traer los datos de la cliente con ese ID
    const consulta = `SELECT * FROM clientes 
    WHERE id = ?`;

    // Ejecutar la consulta
    const [rows] = await conexionesDb.query(consulta, [clienteId]);

    // Retornar los datos en formato JSON
    respuesta.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar mascota', error);
    //En caso de que haya un error arroja un Json con el mensaje del error
    console.error(error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.

  try {
    const datos = peticion.body;

    // aca estoy declarando la consulta que me ayudara a mostrar los datos que necesito.
    const consulta = `INSERT INTO clientes(nombre, email, telefono, cedula) VALUES (?, ? , ? , ?)`;

    // Consultar el listado de clientes.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [datos.nombre, datos.email, datos.telefono, datos.cedula]);

    respuesta.json({
      //Si se creo voy a mostrar
      mensaje: 'cliente creado exitosamente.'
    });
  } catch (error) {
    //si falla voy a mostrar
    console.error('Error al insertar los clientes', error)
    // esta respuesta indica que hay un error con el servidor y se va a presentar
    // en un json con un mensaje de error para evitar que la app se creashee por lo que va a poner el texto.
    respuesta.status(500).json({
      error: 'Error al conectar con el servidor'
    })
  }
})

module.exports = router;

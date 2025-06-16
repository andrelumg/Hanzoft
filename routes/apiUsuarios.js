var express = require('express');
var router = express.Router();
// 1. Conectarme a la base de datos.
var conexionesDb = require('../db');


/* GET users listing. */
router.get('/', async function (peticion, respuesta) {
  // Controlador

  try {
    const consulta = 'SELECT id, nombre, email, rol FROM usuarios';

    // rows son las filas que devuelve mi consulta.
    // 2. Consultar el listado de usuarios.
    const [rows] = await conexionesDb.query(consulta)

    // 3. Retornar la lista de usuarios en formato JSON.
    respuesta.json(rows);
  } catch (error) {
    console.error('Error al consultar usuarios', error)

    respuesta.status(500).json({
      error: 'Error en el servidor',
    })
  }
});

//mostrar
router.get('/:userId', async function (peticion, respuesta) {
  // Controlador

  const userId = peticion.params.userId;

  try {
    const consulta = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';

    // rows son las filas que devuelve mi consulta.
    // 2. Consultar el listado de usuarios.
    const [rows] = await conexionesDb.query(consulta, [userId])

    // 3. Retornar la lista de usuarios en formato JSON.
    respuesta.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar usuario ' + userId, error)

    respuesta.status(500).json({
      error: 'Error en el servidor',
    })
  }
});

//Metodo para poder agregar un usuario
router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.

  try {
    const datos = peticion.body;

    // aca estoy declarando la consulta que me ayudara a mostrar los datos que necesito.
    const consulta = `INSERT INTO usuarios(nombre, email, contrasena, rol) VALUES (?, ? , ? , ?)`;

    // Consultar el listado de clientes.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [datos.nombre, datos.email, datos.contrasena, datos.rol]);

    respuesta.json({
      //Si se creo voy a mostrar
      mensaje: 'El usuario creado exitosamente.'
    });
  } catch (error) {
    //si falla voy a mostrar
    console.error('Error al insertar el usuario', error)
    // esta respuesta indica que hay un error con el servidor y se va a presentar
    // en un json con un mensaje de error para evitar que la app se creashee por lo que va a poner el texto.
    respuesta.status(500).json({
      error: 'Error al conectar con el servidor'
    })
  }
})

//eliminar... por ahora no lo voy a usar.
router.delete('/:usuarioId', async function (peticion, respuesta) {
  //Obtengo el Id del cliente desde los parametros de la URL

  const usuarioId = peticion.params.usuarioId;

  try {

    const consulta = `DELETE FROM usuarios 
    WHERE usuarios.id = ?`

    await conexionesDb.query(consulta, [usuarioId]);

    respuesta.json({
      //Si logro eliminar pongo este mensaje 
      mensaje: 'Usuario eliminado exitosamente.'
    });

  } catch (error) {
    console.error('Error en el usuariooo', error);

    respuesta.status(500).json({
      error: 'Error en el servidor',
    })

  };
});




module.exports = router;
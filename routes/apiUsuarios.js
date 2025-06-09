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

module.exports = router;
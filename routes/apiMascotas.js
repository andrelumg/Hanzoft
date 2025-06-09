var express = require('express');
var router = express.Router();
// 1. Conectarme a la base de datos.
var conexionesDb = require('../db');

//obtener la lista de mascotas
router.get('/', async function (peticion, respuesta) {
  // Controlador
  try {
    const consulta = `
      SELECT mascotas.id, mascotas.nombre, mascotas.especie, mascotas.fecha_nacimiento, clientes.nombre AS "cliente"
      FROM mascotas
      INNER JOIN clientes ON clientes.id = mascotas.clientes_id
    `;

    // 2. Consultar el listado de usuarios.
    const [filas] = await conexionesDb.query(consulta)
    // 3. Retornar la lista de usuarios en formato JSON.
    respuesta.json(filas);
  } catch (error) {
    console.error('Error al consultar las mascotas', error)

    respuesta.status(500).json({
      error: 'Error al conectar con el servidor'
    })
  }

});

// Ruta GET para obtener los datos de una mascota por su ID
router.get('/mascotas/:mascotaId', async function (peticion, respuesta) {
  // Obtener el ID de la mascota desde los parámetros de la URL
  const mascotaId = peticion.params.mascotaId;

  // Manejo de errores con try...catch
  try {
    // Consulta SQL para traer los datos de la mascota con ese ID
    const consulta = `SELECT mascotas.id, mascotas.nombre, mascotas.especie, mascotas.fecha_nacimiento, clientes.nombre AS 'tutor'
    FROM mascotas 
    INNER JOIN clientes ON mascotas.clientes_id = clientes.id 
    WHERE mascotas.id = ?`;

    // Ejecutar la consulta
    const [rows] = await conexionesDb.query(consulta, [mascotaId]);

    // Retornar los datos en formato JSON
    respuesta.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar mascota', error);
    console.error(error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});
module.exports = router;
var express = require('express');
var router = express.Router();
// genero la conexon a la base de datos
var conexionesDb = require('../db');

//Voy a obtener la lista de las citas
router.get('/', async function (peticion, respuesta) {
  // Controlador
  try {
    const consulta = `
      SELECT citas.id , mascotas.nombre AS "mascota" , doctores.nombre AS "doctor", citas.fecha, citas.estado, citas.motivo, usuarios.nombre AS "usuario"
      FROM citas
      INNER JOIN mascotas ON mascotas.id = citas.mascotas_id
      INNER JOIN doctores ON doctores.id = citas.doctores_id
      INNER JOIN usuarios ON usuarios.id = citas.usuarios_id
    `;
    // 2. Consultar el listado de usuarios.
    const [filas] = await conexionesDb.query(consulta)
    // 3. Retornar la lista de usuarios en formato JSON.
    respuesta.json(filas);
  } catch (error) {
    console.error('Error al consultar las citas', error)

    respuesta.status(500).json({
      error: 'Error al conectar con el servidor O_0'
    })
  }

});
// Ruta GET para obtener los datos de una cita por su ID
router.get('/:citaId', async function (peticion, respuesta) {
  // Obtener el ID de la cita desde los parámetros de la URL
  const citaId = peticion.params.citaId;

  // Manejo de errores con try...catch
  try {
    const consulta =`SELECT citas.id , mascotas.id AS mascotas_id, mascotas.nombre AS mascota_nombre , doctores.id AS doctores_id, doctores.nombre AS doctor_nombre, 
    citas.fecha, citas.estado, citas.motivo, usuarios.id as usuarios_id, usuarios.nombre AS usuario_cita
      FROM citas
      INNER JOIN mascotas ON mascotas.id = citas.mascotas_id
      INNER JOIN doctores ON doctores.id = citas.doctores_id
      INNER JOIN usuarios ON usuarios.id = citas.usuarios_id
      WHERE citas.id = ?`

    // Ejecutar la consulta
    const [rows] = await conexionesDb.query(consulta, [citaId]);

    // Retornar los datos en formato JSON
    respuesta.json(rows[0]);
  } catch (error) {
    console.error('Error al consultar la cita', error);
    console.error(error);
    respuesta.status(500).json({
      error: 'Error en el servidor :(',
    });
  }
});

//Metodo para agregar una cita
router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    //o sea mi html que generare.
    const datos = peticion.body;
    //Yo deberia traer el dato del nombre del cliente por lo que lo creo aca
    // y lo casteo como numero para poderlo asociar, en el html creare
    //una lista en donde mostrare los datos completos
    const mascotasId = datos.mascotas_id;
    const doctoresId = datos.doctores_id;
    const usuariosId = datos.usuarios_id;

    //aca estoy declarando la consulta que me ayuda a validar que datos
    //debo ingresar en mi nueva cita
    const consulta = `INSERT INTO citas(mascotas_id, doctores_id, fecha, motivo, usuarios_id) 
    VALUES (?, ?, ?, ?, ?)`;

    // Consultar el listado de mascotas.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [mascotasId, doctoresId, datos.fecha, datos.motivo, usuariosId]);
    
    //Si todo se realizo bien se va a mostrar un mensaje:
    respuesta.json({
      mensaje: 'La cita ha sido generada en el sistema'
    });

  } catch (error) {
    //pero si falla este es el mensaje que va a mostrar
    console.error('Error al asignar la cita', error)
    //declaro una variable errorMensaje donde guardare lo que voy a decir si falla
    let errorMensaje;

    if (error.message.trim() !== '') {
      errorMensaje = error.message;
    } else {
      errorMensaje = 'Error al conectar con el servidor';
    }
    respuesta.status(500).json({
      error: errorMensaje,
    })
  }
})


// Ruta POST para eliminar los datos de una cita por su ID
router.delete('/:citaId', async function (peticion, respuesta) {
  // Obtener el ID de la cita desde los parámetros de la URL
  const citasId = peticion.params.mascotaId;

  // Manejo de errores con try...catch
  try {
    if (citasId.trim() == "") {
      throw new Error('El id de la cita es requerido.');
    }
    // Consulta SQL para borrar los datos de la cita con ese ID
    const consulta = `DELETE FROM citas WHERE citas.id = ?`;
    // Ejecutar la consulta

    await conexionesDb.query(consulta, [citasId]);
    //Aca, traigo mi respuestay la envio n un json, si todo sale bien:
    respuesta.json({
      //Si logro eliminar pongo este mensaje 
      mensaje: 'Cita eliminada exitosamente.'
    });

  } catch (error) {
    console.error('Error en la cita', error);

    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

// Ruta PUT para obtener los datos de una cita por su ID y modificarlos
router.put('/:citaId', async function (peticion, respuesta) {
  // Obtener el ID de la cita  desde los parámetros de la URL
  const citaId = peticion.params.citaId;
  // Manejo de errores con try...catch
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    const datos = peticion.body;
    
    const mascotaId = datos.mascotas_id
    const doctoresId = datos.doctores_id;
    const fecha = datos.fecha;
    const estado = datos.estado;
    const motivo =datos.motivo;
    const usuariosId = datos.usuarios_id;
    // Consulta SQL para modificar los datos de la cita desde su ID
    //una vez se asigne el resultado de la consulta, procedo a ejecutar la modificacion

    const consultaModificacion = `UPDATE citas
      SET mascotas.nombre = ?, mascotas.especie = ?, mascotas.fecha_nacimiento= ?, mascotas.clientes_id= ?
      WHERE mascotas.id = ?`
      `UPDATE citas 
      SET mascotas_id = ? ,doctores_id = ? ,fecha = ?, estado = ?, motivo = ? ,usuarios_id = ? 
      WHERE citas.id = ?`

    // Aca le paso los tres parametros aunque solament se realicen dos,porque necesito el ID
    await conexionesDb.query(consultaModificacion, [mascotaId, doctoresId, fecha, estado, motivo, usuariosId]);
    // Se responde con un mensaje de confirmación cuando se
    // realice el cambio porque los datos actualizados se verán al recargar desde el HTML.
    respuesta.json({
      mensaje: 'Los datos de la cita han sido actualizados'
    });
  } catch (error) {
    console.error('Error al modificar la cita', error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});


module.exports = router;
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
router.get('/:mascotaId', async function (peticion, respuesta) {
  // Obtener el ID de la mascota desde los parámetros de la URL
  const mascotaId = peticion.params.mascotaId;

  // Manejo de errores con try...catch
  try {
    // Consulta SQL para traer los datos de la mascota con ese ID
    const consulta =`SELECT mascotas.id, mascotas.nombre, mascotas.especie, mascotas.fecha_nacimiento, 
    clientes.id AS clientes_id, clientes.nombre AS tutor
    FROM mascotas 
    INNER JOIN clientes ON mascotas.clientes_id = clientes.id
    WHERE mascotas.id = ?`

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
//Metodo para agregar una mascota
router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    //o sea mi html que generare.
    const datos = peticion.body;
    //Yo deberia traer el dato del nombre del cliente por lo que lo creo aca
    // y lo casteo como numero para poderlo asociar, en el html creare
    //una lista en donde mostrare los datos completos
    const clientesId = datos.clientes_id;

    //aca estoy declarando la consulta que me ayuda a validar que datos
    //debo ingresar en mi nueva mascota
    const consulta = `INSERT INTO mascotas(nombre, especie, fecha_nacimiento, clientes_id) 
    VALUES (?, ?, ?, ?)`;

    // Consultar el listado de mascotas.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [datos.nombre, datos.especie, datos.fecha_nacimiento,
      clientesId]);
    if (datos.nombre.trim() == "" || datos.especie.trim() == "" ||
      datos.fecha_nacimiento == "" || datos.clientesId == "") {

      throw new Error('Los datos no pueden estar vacios.');
    }
    //Si todo se realizo bien se va a mostrar un mensaje:
    respuesta.json({
      mensaje: 'La mascota ha sido registrada en el sistema'
    });

  } catch (error) {
    //pero si falla este es el mensaje que va a mostrar
    console.error('Error al crear la mascota', error)
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


// Ruta POST para eliminar los datos de una mascota por su ID
router.delete('/:mascotaId', async function (peticion, respuesta) {
  // Obtener el ID de la mascota  desde los parámetros de la URL
  const mascotaId = peticion.params.mascotaId;

  // Manejo de errores con try...catch
  try {
    if (mascotaId.trim() == "") {
      throw new Error('El id de la mascota es requerido.');
    }
    // Consulta SQL para borrar los datos de la mascota con ese ID
    const consulta = `DELETE FROM mascotas WHERE mascotas.id = ?`;
    // Ejecutar la consulta

    await conexionesDb.query(consulta, [mascotaId]);
    //Aca, traigo mi respuestay la envio n un json, si todo sale bien:
    respuesta.json({
      //Si logro eliminar pongo este mensaje 
      mensaje: 'Mascota eliminada exitosamente.'
    });

  } catch (error) {
    console.error('Error la mascota', error);

    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

// Ruta PUT para obtener los datos de uuna mascota por su ID y modificarlos
router.put('/:mascotaId', async function (peticion, respuesta) {
  // Obtener el ID de la mascota  desde los parámetros de la URL
  const mascotaId = peticion.params.mascotaId;
  // Manejo de errores con try...catch
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    const datos = peticion.body;
    
    const nombre = datos.nombre;
    const especie = datos.especie;
    const fecha_nacimiento = datos.fecha_nacimiento;
    const clientesId = datos.clientes_id;
    // Consulta SQL para modificar los datos del doctor desde su ID
    //una vez se asigne el resultado de la consulta, procedo a ejecutar la modificacion

    const consultaModificacion = `UPDATE mascotas
      SET mascotas.nombre = ?, mascotas.especie = ?, mascotas.fecha_nacimiento= ?, mascotas.clientes_id= ?
      WHERE mascotas.id = ?`

    // Aca le paso los tres parametros aunque solament se realicen dos,porque necesito el ID
    await conexionesDb.query(consultaModificacion, [nombre, especie, fecha_nacimiento, clientesId, mascotaId]);
    // Se responde con un mensaje de confirmación cuando se
    // realice el cambio porque los datos actualizados se verán al recargar desde el HTML.
    respuesta.json({
      mensaje: 'Los datos de la mascota han sido actualizados'
    });
  } catch (error) {
    console.error('Error al modificar la mascota', error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});


module.exports = router;
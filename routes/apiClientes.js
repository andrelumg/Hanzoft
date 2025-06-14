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
    const consulta = `
      SELECT * FROM clientes 
      WHERE id = ?
    `;

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

//Metodo para poder agregar un cliente
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

//eliminar
router.delete('/:clienteId', async function (peticion, respuesta) {
  //Obtengo el Id del cliente desde los parametros de la URL

  const clienteId = peticion.params.clienteId;

  try {
    if (clienteId.trim() == "") {
      throw new Error('El id de la mascota es requerido.');
    }

    const consulta = `DELETE FROM clientes 
    WHERE clientes.id = ?`

    await conexionesDb.query(consulta, [clienteId]);

    respuesta.json({
      //Si logro eliminar pongo este mensaje 
      mensaje: 'Cliente eliminado exitosamente.'
    });

  } catch (error) {
    console.error('Error en el cliente', error);

    respuesta.status(500).json({
      error: 'Error en el servidor',
    })

  };
});

//Modificar Cliente

// Ruta PUT para obtener los datos de uuna mascota por su ID y modificarlos
router.put('/:clienteId', async function (peticion, respuesta) {
  // Obtener el ID de la mascota  desde los parámetros de la URL
  const clienteId = peticion.params.clienteId;
  // Manejo de errores con try...catch
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    const datos = peticion.body;
    
    const nombre = datos.nombre;
    const email = datos.email;
    const telefono = datos.telefono;
    const cedula = datos.cedula;
    // Consulta SQL para modificar los datos del doctor desde su ID
    //una vez se asigne el resultado de la consulta, procedo a ejecutar la modificacion

    const consultaModificacion = `UPDATE clientes
      SET clientes.nombre = ?, clientes.email = ?, clientes.telefono= ?, clientes.cedula= ?
      WHERE clientes.id = ?`

    // Aca le paso los tres parametros aunque solament se realicen dos,porque necesito el ID
    await conexionesDb.query(consultaModificacion, [nombre, email, telefono, cedula, clienteId]);
    // Se responde con un mensaje de confirmación cuando se
    // realice el cambio porque los datos actualizados se verán al recargar desde el HTML.
    respuesta.json({
      mensaje: 'Los datos del cliente han sido actualizados'
    });
  } catch (error) {
    console.error('Error al modificar el cliente', error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

module.exports = router;

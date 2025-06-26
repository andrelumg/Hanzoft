// Controlador para el api de doctores.

var express = require('express');
var router = express.Router();
var app = express();
app.use(express.json());// Permite que el servidor entienda datos en formato JSON
// 1. Conectarme a la base de datos.  
var conexionesDb = require('../db');


//obtener la lista de doctores
router.get('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.

  try {
    // aca estoy declarar la consulta que me ayudara a mostrar los datos que necesito.
    const consulta = `SELECT doctores.id, doctores.nombre AS 'nombre', especialidades.nombre AS 'especialidad'
    FROM especialidades
    INNER JOIN doctores ON doctores.especialidades_id = especialidades.id`;

    // Consultar el listado de doctores.
    // aca me retorna un array 
    const [filas] = await conexionesDb.query(consulta)
    // Retornar la lista de doctores en formato JSON.
    respuesta.json(filas);
  } catch (error) {
    //este es el mensaje que va a mostrar si falla
    console.error('Error al consultar las doctores', error)
    // esta respuesta indica que hay un error con el servidor y se va a presentar
    // en un json con un mensaje de error para evitar que la app se creashee por lo que va a poner el texto.
    respuesta.status(500).json({
      error: 'Error al conectar con el servidor'
    })
  }
})

// Ruta GET para obtener los datos de un doctor por su ID
router.get('/:doctorId', async function (peticion, respuesta) {
  // Obtener el ID del doctor desde los parámetros de la URL
  const doctorId = peticion.params.doctorId;

  // Manejo de errores con try...catch
  try {
    // Consulta SQL para traer los datos de la mascota con ese ID
    const consulta = `SELECT doctores.id , doctores.nombre , doctores.especialidades_id, especialidades.nombre AS 'especialidad'
    FROM especialidades
    INNER JOIN doctores ON doctores.especialidades_id = especialidades.id
    WHERE doctores.id = ?`;

    // Ejecutar la consulta
    const resultado = await conexionesDb.query(consulta, [doctorId]);
    // Asigno las filas que vienen en el resultado de la consulta a una nueva variable.
    const filas = resultado[0];
    // Como las filas retornadas siempre es un array, el objeto que representa el doctor viene en la primera
    // posicion del array, asi que eso es lo que devuelvo en la respuesta.

    const doctor = filas[0];
    respuesta.json(doctor);
  } catch (error) {
    console.error('Error al consultar al doctor', error);
    console.error(error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

//Metodo para agregar un doctor
router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.

  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    const datos = peticion.body;
    const especialidadId = Number(datos.especialidad)

    // aca estoy declarando la consulta que me ayudara a mostrar los datos que necesito.
    const consulta = `INSERT INTO doctores (nombre, especialidades_id) VALUES (?, ?)`;

    // Consultar el listado de doctores.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [datos.nombre, especialidadId])
    if (datos.nombre.trim() == "" || datos.especialidadId == "") {
      throw new Error('Los datos no pueden estar vacios.');
    }

    respuesta.json({
      //Si se creo voy a mostrar
      mensaje: 'Doctor creado exitosamentes.'
    });

  } catch (error) {
    //este es el mensaje que va a mostrar si falla
    console.error('Error al consultar las doctores', error)
    // esta respuesta indica que hay un error con el servidor y se va a presentar
    // en un json con un mensaje de error para evitar que la app se creashee por lo que va a poner el texto.

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

// Ruta POST para eliminar los datos de un doctor por su ID
router.delete('/:doctorId', async function (peticion, respuesta) {
  // Obtener el ID del doctor  desde los parámetros de la URL
  const doctorId = peticion.params.doctorId;

  // Manejo de errores con try...catch
  try {
    if (doctorId.trim() == "") {
      throw new Error('El id del doctor es requerido.');
    }
  // Consulta SQL para borrar los datos del doctor con ese ID
    const consulta = `DELETE FROM doctores WHERE doctores.id = ?`;
    // Ejecutar la consulta

    await conexionesDb.query(consulta, [doctorId]);

    // Como las filas retornadas siempre es un array, el objeto que representa el doctor viene en la primera
    // posicion del array, asi que eso es lo que devuelvo en la respuesta.
    // mi condicion deberia arrojar error cuando el DoctorId no existe.
    respuesta.json({
      //Si logro eliminar pongo este mensaje 
      mensaje: 'Doctor eliminado exitosamente.'
    });

  } catch (error) {
    console.error('Error al eliminar el doctor', error);

    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

// Ruta PUT para obtener los datos de un doctor por su ID y modificarlos
router.put('/:doctorId', async function (peticion, respuesta) {
  // Obtener el ID del doctor desde los parámetros de la URL
  const doctorId = peticion.params.doctorId;
  // Manejo de errores con try...catch
  try {
    //aquí se guardan los datos que el usuario envió desde el formulario o cliente frontend
    const datos = peticion.body;
    const nombre = datos.nombre;
    const especialidades_id = Number(datos.especialidad);
    // Consulta SQL para modificar los datos del doctor desde su ID
    //una vez se asigne el resultado de la consulta, procedo a ejecutar la modificacion

    const consultaModificacion = `
      UPDATE doctores
      SET doctores.nombre = ?, doctores.especialidades_id = ?
      WHERE doctores.id = ?`

    // Aca le paso los tres parametros aunque solament se realicen dos,porque necesito el ID
    await conexionesDb.query(consultaModificacion, [nombre, especialidades_id, doctorId]);
    // Se responde con un mensaje de confirmación cuando se
    // realice el cambio porque los datos actualizados se verán al recargar desde el HTML.
    respuesta.json({
      mensaje: 'Los datos del doctor han sido actualizados'
    });
  } catch (error) {
    console.error('Error al modificar al doctor', error);
    respuesta.status(500).json({
      error: 'Error en el servidor',
    });
  }
});

module.exports = router;

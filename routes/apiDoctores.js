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
    const consulta = `SELECT doctores.id, doctores.nombre AS 'doctor', especialidades.nombre AS 'especialidad'
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
  // Obtener el ID de la mascota desde los parámetros de la URL
  const doctorId = peticion.params.doctorId;

  // Manejo de errores con try...catch
  try {
    // Consulta SQL para traer los datos de la mascota con ese ID
    const consulta = `SELECT doctores.id , doctores.nombre , especialidades.nombre AS 'especialidad'
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

router.post('/', async function (peticion, respuesta) {
  //try catch para controlar si llega a haber un error.

  try {
    const datos = peticion.body;
    const especialidadId = Number(datos.especialidad)

    // aca estoy declarando la consulta que me ayudara a mostrar los datos que necesito.
    const consulta = `INSERT INTO doctores (nombre, especialidades_id) VALUES (?, ?)`;

    // Consultar el listado de doctores.
    // aca me retorna un array 
    await conexionesDb.query(consulta, [datos.nombre, especialidadId])

    respuesta.json({
      //Si se creo voy a mostrar
      mensaje: 'Doctor creado exitosamente.'
    });
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

module.exports = router;

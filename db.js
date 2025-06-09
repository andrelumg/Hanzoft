const mysql = require('mysql2/promise')


// Aqui inicializo el grupo de conexiones usando el metodo de la libreria createPool.
// Se deben pasarle parametros de inicio conexion a la base de datos.
const conexionesDb = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = conexionesDb
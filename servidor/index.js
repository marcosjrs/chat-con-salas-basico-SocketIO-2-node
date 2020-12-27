//Para manejar rutas
const path = require("path");

//Servidor Express
const express = require("express");
const app = express();
// Si la maquina tiene configurado PORT, cojerá ese, sino el 3000
app.set('port', process.env.PORT || 3000);
// con path.join nos abstraemos del sistema operativo, por aquello de las "/" o "\" en rutas
// los .. es porque estamos en servidor y tenemos que subir un nivel para llegar a public
app.use(express.static(path.join(__dirname, '..', 'public')));
// Lanzamos el servidor en el puerto configurado antes
const servidor = app.listen(app.get('port'), () => {
    console.log('Servidor Express en puerto', app.get('port'));
});

//Socket.io conexion al servidor express y listenings
const socketIo = require('socket.io');
module.exports.io = socketIo(servidor); // para poder hacer una 'importación' en ./sockets/socket.js de objeto io
require('./sockets/socket');
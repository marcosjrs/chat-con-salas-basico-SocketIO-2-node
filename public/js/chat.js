//Usamos el objeto io, que nos viene dado del socket.io.js que lo general automaticamente el Socket.IO
var socket = io(); // Hará que salte el listen de 'connection' en la parte Back

var params = new URLSearchParams(window.location.search);
if (!params.has('nombre')) {
    window.location = 'index.html';
}
var nombre = params.get('nombre');
$("#lblNombreUsuario").text(nombre);

//Elementos del DOM 


//Ejemplo de emisión desde cliente
socket.emit(
    'chat:peticionEntradaDeUsuarioEnChat',
    { nombre: nombre },
    function (infoPasadaPorServidor) {
        console.log('Respuesta Servidor: ', infoPasadaPorServidor);
       
        let txtUsuarios = '';
        var usuarios = infoPasadaPorServidor.usuarios;
        for (let i = 0; i < usuarios.length; i++) {
            txtUsuarios += '<li><p>'+usuarios[i].nombre+'</p></li>';
            
        }
        $("#usuarios").html(txtUsuarios);
        
    }
);

//Escuchamos conexion, desconexión y otros eventos del socket del servidor
socket.on('connect', function () {
    console.log('[cliente conectado]');
});
socket.on('disconnect', function () {
    console.log('[cliente perdió conexión con servidor]');
});
socket.on('chat:informacionDesdeServidor', function (informacion) {
    console.log(informacion);
});


// Escuchamos el evento emitido por el servidor, que lo emite cuando se le envia un mensaje nuevo
// desde algún cliente.
socket.on('chat:entradaDeUsuarioEnChat', function (mensaje) {

});



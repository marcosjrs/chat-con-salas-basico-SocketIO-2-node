//Usamos el objeto io, que nos viene dado del socket.io.js que lo general automaticamente el Socket.IO
var socket = io(); // Hará que salte el listen de 'connection' en la parte Back

//Elementos del DOM 
var $lblNombreUsuario = $("#lblNombreUsuario");
var $lblEstado = $("#estado");
var $listUsuarios = $("#usuarios");


var params = new URLSearchParams(window.location.search);
if (!params.has('nombre')) {
    window.location = 'index.html';
}
var nombre = params.get('nombre');
$lblNombreUsuario.text(nombre);

function actualizacionListadoUsuariosEnChat(usuarios){    
    let txtUsuarios = '';
    for (let i = 0; i < usuarios.length; i++) {
        txtUsuarios += '<li><p>'+usuarios[i].nombre+'</p></li>';        
    }
    $listUsuarios.html(txtUsuarios);
}


//Ejemplo de emisión desde cliente
socket.emit(
    'chat:peticionEntradaDeUsuarioEnChat',
    { nombre: nombre },
    function (infoPasadaPorServidor) {   
        console.log('Respuesta Servidor: ', infoPasadaPorServidor);    
        actualizacionListadoUsuariosEnChat(infoPasadaPorServidor.usuarios);
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
socket.on('chat:actualizacionUsuariosEnChat', function (datosDesdeServidor) { 
    actualizacionListadoUsuariosEnChat(datosDesdeServidor.usuarios);
});
socket.on('chat:salidaDeUsuarioEnChat', function (datosDesdeServidor) {
    $lblEstado.text("Salió de la sala "+datosDesdeServidor.usuarioSalio.nombre+"... ");
    setTimeout(function(){$lblEstado.text("")}, 5000);
});



//Usamos el objeto io, que nos viene dado del socket.io.js que lo general automaticamente el Socket.IO
var socket = io(); // Hará que salte el listen de 'connection' en la parte Back

//Variables. Elementos del DOM y Recogida de parametros
var $mensaje = $('#mensaje');
var $lblSala = $("#lblSala");
var $lblNombreUsuario = $("#lblNombreUsuario");
var $lblEstado = $("#estado");
var $listUsuarios = $("#usuarios");
var $btnEnviar = $('#enviar');
var $listMensajes = $('#mensajes');
var $panelUsuarios = $('.panel-usuarios');
var $panelMensajes = $('.panel-mensajes');
var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
}
var nombre = params.get('nombre');
var sala = params.get('sala');

//Muestra de valores iniciales en la vista
$lblSala.text(sala);
$lblNombreUsuario.text(nombre);

//Funciones
function actualizacionListadoUsuariosEnChat(usuarios){    
    let txtUsuarios = '';
    for (let i = 0; i < usuarios.length; i++) {
        txtUsuarios += '<li><p>'+usuarios[i].nombre+'</p></li>';        
    }
    $listUsuarios.html(txtUsuarios);
    $panelUsuarios.scrollTop($listUsuarios[0].scrollHeight);
}

//Listeners sobre eventos de los objetos de DOM
enviar.addEventListener('click', function (evt) {
    //emitimos el evento para que lo capture el servidor, luego el servidor emitirá otro evento de nuevomensaje
    // que lo escucharán todos los clientes, para actualizar el chat de cada uno.
    socket.emit(
        'chat:mensaje',
        { nombre: nombre, sala: sala , mensaje: $mensaje.val() },
        function(infoPasadaPorServidor){
            console.log('Respuesta Servidor: ',infoPasadaPorServidor);
        }
    );
    $mensaje.val("");
});


//Ejemplo de emisión desde cliente
socket.emit(
    'chat:peticionEntradaDeUsuarioEnChat',
    { nombre: nombre, sala: sala },
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


// Escuchamos cambios de usuarios
socket.on('chat:entradaDeUsuarioEnChat', function (datosDesdeServidor) {
    $lblEstado.text("Entró en la sala "+datosDesdeServidor.usuario.nombre+"... ");
    setTimeout(function(){$lblEstado.text("")}, 5000);
});
socket.on('chat:salidaDeUsuarioEnChat', function (datosDesdeServidor) {
    $lblEstado.text("Salió de la sala "+datosDesdeServidor.usuario.nombre+"... ");
    setTimeout(function(){$lblEstado.text("")}, 5000);
});
socket.on('chat:actualizacionUsuariosEnChat', function (datosDesdeServidor) { 
    actualizacionListadoUsuariosEnChat(datosDesdeServidor.usuarios);
});

// Escuchamos cambios de mensajes
socket.on('chat:nuevomensaje', function(mensaje){
    console.log(mensaje);
    const claseSiEsMiMsg = mensaje.nombre == nombre ? 'mi-mensaje' : '';
    mensajes.innerHTML += `<li class="left clearfix ${claseSiEsMiMsg}">
        <div class="chat-body clearfix">
            <div class="header">
                <strong class="primary-font">${mensaje.nombre}</strong>
            </div>
            <p>${mensaje.mensaje}</p>
        </div>
    </li>`; 
    $panelMensajes.scrollTop($listMensajes[0].scrollHeight);
});



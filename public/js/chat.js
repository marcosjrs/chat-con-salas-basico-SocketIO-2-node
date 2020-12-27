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
var sala = params.has('privado') ? 'privado': params.get('sala');
var idUsuario;

//Muestra de valores iniciales en la vista
$lblSala.text(sala);
$lblNombreUsuario.text(nombre);

//Funciones
function actualizacionListadoUsuariosEnChat(usuarios){    
    let txtUsuarios = '';
    for (let i = 0; i < usuarios.length; i++) {
        if(idUsuario !== usuarios[i].id){  
            let idEnlace = idUsuario > usuarios[i].id ? idUsuario+"_"+usuarios[i].id : usuarios[i].id+"_"+idUsuario;        
            txtUsuarios += '<li><p><span data-relacion="'+idEnlace+'"></span><a data-usuario-destino="'+usuarios[i].id+'" class="enlace-privado" href="chat.html?nombre='+nombre+'&privado=true&sala='+idEnlace+'" target="_blank">'+usuarios[i].nombre+'</a></p></li>';        
        }else{
            txtUsuarios += '<li><p>'+usuarios[i].nombre+'</p></li>';    
        }
    }
    $listUsuarios.html(txtUsuarios);
    $panelUsuarios.scrollTop($listUsuarios[0].scrollHeight);
    escucharAvisoMensajePrivado();
}

function escucharAvisoMensajePrivado(){
    $(".enlace-privado").click(function(evt){
        var idDestino = evt.target.attributes['data-usuario-destino'].value;
        socket.emit(
            'chat:mensajePrivado',
            { nombre: nombre, idUsuario: idUsuario, sala: sala, idUsuarioDestino: idDestino },
            function(infoPasadaPorServidor){
                console.log('Respuesta Servidor: ',infoPasadaPorServidor);
            }
        );
    });
}

//Listeners sobre eventos de los objetos de DOM
enviar.addEventListener('click', function (evt) {
    //emitimos el evento para que lo capture el servidor, luego el servidor emitirá otro evento de nuevomensaje
    // que lo escucharán todos los clientes, para actualizar el chat de cada uno.
    socket.emit(
        'chat:mensaje',
        { nombre: nombre, idUsuario: idUsuario, sala: sala , mensaje: $mensaje.val() },
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
    idUsuario = informacion.idUsuario;
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
    const claseSiEsMiMsg = mensaje.idUsuario == idUsuario ? 'mi-mensaje' : '';
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
socket.on('chat:avisoMensajePrivado', function(mensaje){
    let idEnlace = mensaje.idUsuario > mensaje.idUsuarioDestino ? mensaje.idUsuario+"_"+mensaje.idUsuarioDestino : mensaje.idUsuarioDestino+"_"+mensaje.idUsuario;   
    $("[data-relacion="+idEnlace+"]").text("(privado) ");    
});



//Usamos el objeto io, que nos viene dado del socket.io.js que lo general automaticamente el Socket.IO
const socket = io(); // Hará que salte el listen de 'connection' en la parte Back
//Elementos del DOM 

//Ejemplo de emisión desde cliente
socket.emit(
    'aplicacion:eventoDelCliente',
    {  },
    function(infoPasadaPorServidor){
        console.log('Respuesta Servidor: ',infoPasadaPorServidor);
    }
);

//Escuchamos conexion, desconexión y otros eventos del socket del servidor
socket.on('connect', function(){
    console.log('[cliente conectado]');
});
socket.on('disconnect', function(){
    console.log('[cliente perdió conexión con servidor]');
});
socket.on('aplicacion:informacionDesdeServidor', function(informacion){
    console.log(informacion);
});


// Escuchamos el evento emitido por el servidor, que lo emite cuando se le envia un mensaje nuevo
// desde algún cliente.
socket.on('aplicacion:eventoParaQueActualiceEnTodosClientes', function(mensaje){
   
});



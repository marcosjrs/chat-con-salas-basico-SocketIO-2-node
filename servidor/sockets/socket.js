const { io } = require('../index');

io.on('connection', (conexionDeUnCliente) => {

    console.log('[Nuevo cliente conectado]', conexionDeUnCliente.id);
    //Enviando eventos al cliente
    conexionDeUnCliente.emit('aplicacion:informacionDesdeServidor', {
        version: '0.0.1',
        texto: 'Bienvenido a esta aplicación'
    });

    //Escuchando eventos de cliente
    conexionDeUnCliente.on('aplicacion:eventoDelCliente', (mensaje, callbackDeCliente) => {
        //Enviamos el mensaje a todos los que están conectados a este servidor de socket
        io.sockets.emit('aplicacion:eventoParaQueActualiceEnTodosClientes', mensaje);
        //solo al resto, sería ¿? :
        //conexionDeUnCliente.broadcast.emit('aplicacion:eventoParaQueActualiceEnTodosClientes', mensaje);
        //LLamamos a la función que nos indica el cliente (se ejecutará en el cliente)
        let ok = false;
        if (mensaje.usuario && mensaje.mensaje) {
            ok = true;
        }
        callbackDeCliente({ ok });
    });
    conexionDeUnCliente.on('disconnect', (mensaje) => {
        console.log('[Cliente perdió o cerró la conexión con este servidor]');
    });


});
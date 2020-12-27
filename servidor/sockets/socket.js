const { Usuarios } = require('../classes/usuarios');
const { io } = require('../index');

let usuarios = new Usuarios();

io.on('connection', (conexionDeUnCliente) => {

    console.log('[Nuevo cliente conectado]', conexionDeUnCliente.id);
    //Enviando eventos al cliente
    conexionDeUnCliente.emit('chat:informacionDesdeServidor', {
        version: '0.0.1',
        texto: 'Bienvenido al chat'
    });

    //Escuchando eventos de cliente
    conexionDeUnCliente.on('chat:peticionEntradaDeUsuarioEnChat', (datosDesdeCliente, callbackDeCliente) => {
        if (!datosDesdeCliente.nombre) {
            callbackDeCliente({ ok: false, mensaje: 'Faltan parametros' });
        } else {
            //Devolveremos todos los usuarios de la "sala" (por ahora no está integrada la parte de las salas)
            
            usuarios.add(conexionDeUnCliente.id, datosDesdeCliente.nombre);
            callbackDeCliente({ ok: true, usuario:datosDesdeCliente.nombre , usuarios: usuarios.getAll() });

            //Enviamos el mensaje a todos los que están conectados a este servidor de socket
            //conexionDeUnCliente.broadcast.emit('chat:entradaDeUsuarioEnChat', { });
        }
    });

    conexionDeUnCliente.on('disconnect', () => {
        console.log('[Cliente perdió o cerró la conexión con este servidor]');
        usuarios.del(conexionDeUnCliente.id);
    });


});
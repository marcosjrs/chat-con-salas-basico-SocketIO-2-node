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
        if (!datosDesdeCliente.nombre || !datosDesdeCliente.sala) {
            callbackDeCliente({ ok: false, mensaje: 'Faltan parametros', usuarios:[] });
        } else {     
            const sala = datosDesdeCliente.sala; 
            conexionDeUnCliente.join(sala);        
            usuarios.add(conexionDeUnCliente.id, datosDesdeCliente.nombre, sala);
            callbackDeCliente({ ok: true, usuario:datosDesdeCliente.nombre , usuarios: usuarios.getBySala(sala) });
            conexionDeUnCliente.broadcast.to(sala).emit('chat:entradaDeUsuarioEnChat', { usuario:usuarios.get(conexionDeUnCliente.id) });
            //Devolveremos todos los usuarios de la "sala" (por ahora no está integrada la parte de las salas)     
            conexionDeUnCliente.broadcast.to(sala).emit('chat:actualizacionUsuariosEnChat', { ok: true, usuario:datosDesdeCliente.nombre , usuarios: usuarios.getBySala(sala) });
        }
    });

    conexionDeUnCliente.on('chat:mensaje', (mensaje, callbackDeCliente) => {
        if (!mensaje.nombre || !mensaje.mensaje || !mensaje.sala) {
            callbackDeCliente({ ok: false, mensaje: 'Faltan parametros', usuarios:[] });
            return;
        }
        //Enviamos el mensaje a todos los que están conectados a este servidor de socket de la sala del usuario que envio el mensaje
        io.sockets.to(mensaje.sala).emit('chat:nuevomensaje', mensaje);
        //LLamamos a la función que nos indica el cliente (se ejecutará en el cliente)
        callbackDeCliente({ ok:true });
    });

    conexionDeUnCliente.on('disconnect', () => {
        console.log('[Cliente perdió o cerró la conexión con este servidor]');
        const usuario = usuarios.get(conexionDeUnCliente.id);
        if(!usuario){
            return;
        }
        const sala = usuario.sala;
        usuarios.del(conexionDeUnCliente.id);
        conexionDeUnCliente.broadcast.to(sala).emit('chat:salidaDeUsuarioEnChat', { usuario });
        //Devolveremos todos los usuarios de la "sala" (por ahora no está integrada la parte de las salas)  
        console.log(usuario);
        conexionDeUnCliente.broadcast.to(sala).emit('chat:actualizacionUsuariosEnChat', { ok: true, usuarios: usuarios.getBySala(sala) });
    });


});
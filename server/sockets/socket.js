const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios()


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            })
        }

        client.join(usuario.sala)

        let personas = usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala))

        console.log(personas)
        callback(usuarios.getPersonasPorSala(usuario.sala))

    })

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id)
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} ha salido del chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
    })

    //Mensajes privados
    client.on('mensajePrivado', data => {

        if (!data.mensaje) {
            return {
                ok: false,
                mensaje: 'El mensaje es necesario'
            }
        }

        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.destinatario).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});
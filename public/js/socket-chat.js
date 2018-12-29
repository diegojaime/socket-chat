//import { URL } from "url";

var socket = io();

var params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor')
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('crearMensaje', function(data) {
    console.log(data)
})

//Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
    console.log(personas)
})


// Enviar información
/*
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp)
});
*/

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
})
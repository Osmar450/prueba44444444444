const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variable para almacenar el contador de usuarios conectados
let userCount = 0;

// Manejar conexiones de clientes
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Manejar nombre de usuario
  socket.on('username', (username) => {
    socket.username = username;
    console.log(`El usuario ${username} se ha unido al chat`);
  });

  // Manejar mensajes de texto
  socket.on('message', (msg) => {
    console.log(`Mensaje recibido de ${socket.username}: ${msg}`);
    // Enviar mensaje a todos los clientes, incluyendo el nombre de usuario
    io.emit('message', { message: msg, username: socket.username });
  });

  // Manejar envío de imágenes
  socket.on('image', (imageFile) => {
    console.log(`Imagen recibida de ${socket.username}`);
    // Enviar imagen a todos los clientes, incluyendo el nombre de usuario
    io.emit('image', { imageFile, username: socket.username });
  });

  // Manejar envío de audios
  socket.on('audio', (audioFile) => {
    console.log(`Audio recibido de ${socket.username}`);
    // Enviar audio a todos los clientes, incluyendo el nombre de usuario
    io.emit('audio', { audioFile, username: socket.username });
  });

  // Manejar desconexiones de clientes
  socket.on('disconnect', () => {
    console.log(`El usuario ${socket.username} se ha desconectado`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let numeroSecreto;

function iniciarJuego() {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
}

iniciarJuego();

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    console.log(`Número ingresado: ${message}`);

    const numeroIngresado = parseInt(message);

    if (isNaN(numeroIngresado)) {
      ws.send('Por favor, ingresa un número válido.');
    } else {
      if (numeroIngresado === numeroSecreto) {
        ws.send('¡Felicidades! ¡Has adivinado el número!');
        iniciarJuego(); // Reiniciar el juego para una nueva ronda
      } else if (numeroIngresado < numeroSecreto) {
        ws.send('El número es mayor. Intenta nuevamente.');
      } else {
        ws.send('El número es menor. Intenta nuevamente.');
      }
    }
  });
});

// Configuración de servidor web para servir archivos estáticos (página HTML)
app.use(express.static(path.join(__dirname, 'public')));

server.listen(8080, () => {
  console.log('Servidor WebSocket y página web en ejecución en el puerto 8080');
});

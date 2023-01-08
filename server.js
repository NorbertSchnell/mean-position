const WebSocket = require('ws');

// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });

console.log('server listening on port', port);

const positions = new Map();

// init counters (0 is number of connected clients)
server.on('connection', (socket, req) => {
  const isReceiver = (req.url === '/receiver');

  if (!isReceiver) {
    positions.set(socket, [0.5, 0.5]);
    broadcastMean();
  }


  // receive position from connected client
  socket.on('message', (message) => {
    if (message.length > 0) {
      const pos = JSON.parse(message);
      broadcastMean();
    }
  });

  // client connection closing
  socket.on('close', () => {
    if (!isReceiver) {
      positions.delete(socket);
      broadcastMean();
    }
  });

  // broadcast all counters to all connected clients
  function broadcastMean() {
    let mean = [0, 0];

    for (let socket of server.clients) {
      const pos = positions.get(socket);
      mean[0] += pos[0];
      mean[1] += pos[1];
    }

    mean[0] /= positions.size;
    mean[1] /= positions.size;

    for (let socket of server.clients) {
      socket.send(JSON.stringify(mean));
    }
  }
});

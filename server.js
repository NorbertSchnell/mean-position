const WebSocket = require('ws');
const { Client, Server } = require('node-osc');

// // create WebSocket server with given port
const port = Number(process.env.PORT) || 8000;
const server = new WebSocket.Server({ port: port });

console.log('server listening on port', port);

const oscClient = new Client('localhost', 3333);

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
      const incoming = JSON.parse(message);

      // dispatch incoming 
      switch (incoming.selector) {
        case 'position':
          positions.set(socket, incoming.data);
          broadcastMean();
      }
    } else {
      // send pong message
      socket.send('');
    }
  });

  // client connection closing
  socket.on('close', () => {
    if (!isReceiver) {
      positions.delete(socket);
      broadcastMean();
    }
  });
});

function broadcastMean() {
  let mean = [0, 0];

  for (let socket of server.clients) {
    const pos = positions.get(socket);

    if (pos) {
      mean[0] += pos[0];
      mean[1] += pos[1];
    }
  }

  mean[0] /= positions.size;
  mean[1] /= positions.size;

  const outgoing = { selector: 'mean', data: mean };
  const str = JSON.stringify(outgoing);

  // broadcast message to all connected clients
  for (let socket of server.clients) {
    socket.send(str);
  }

  oscClient.send('/mean', mean[0], mean[1], (err) => {
    if (err) 
      console.error(err);
    //oscClient.close();
  });
}

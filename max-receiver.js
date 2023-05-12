//const socket = new WebSocket('wss://nschnell.uber.space/mean-position/receiver');
const socket = new WebSocket('ws://localhost:8000/receiver');

const meanDot = document.querySelector('.dot.mean');

// listen to connection open
socket.addEventListener('open', (event) => {
  // send regular ping messages
  setInterval(() => {
    if (socket.readyState == socket.OPEN) {
      socket.send('');
    }
  }, 20000);
});

// listen to message from server
socket.addEventListener('message', (event) => {
  const message = event.data;

  if (message.length > 0) {
    const incoming = JSON.parse(message);

    // dispatch incoming message
    switch (incoming.selector) {
      case 'mean':
        const mean = incoming.data;
        meanDot.style.left = `${100 * mean[0]}%`;
        meanDot.style.top = `${100 * mean[1]}%`;
        window.max.outlet('mean', mean[0], mean[1]);
        break;
    }
  }
});

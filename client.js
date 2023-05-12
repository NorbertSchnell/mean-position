const positionDot = document.querySelector('.dot.position');
const meanDot = document.querySelector('.dot.mean');
let mouseIsDown = false;

//const socket = new WebSocket('wss://nschnell.uber.space/mean-position/');
const socket = new WebSocket('ws://localhost:8000');

window.addEventListener('touchstart', onPointerStart, false);
window.addEventListener('touchmove', onPointerMove, false);
window.addEventListener('touchend', onPointerEnd, false);
window.addEventListener('touchcancel', onPointerEnd, false);

window.addEventListener('mousedown', onPointerStart, false);
window.addEventListener('mousemove', onPointerMove, false);
window.addEventListener('mouseup', onPointerEnd, false);
//window.addEventListener('mouseout', onPointerEnd, false);

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

    // dispatch incomming message
    switch (incoming.selector) {
      case 'mean':
        const mean = incoming.data;
        meanDot.style.left = `${100 * mean[0]}%`;
        meanDot.style.top = `${100 * mean[1]}%`;
        break;
    }
  }
});

function setPosition(x, y) {
  x /= document.body.clientWidth;
  y /= document.body.clientHeight;

  positionDot.style.left = `${100 * x}%`;
  positionDot.style.top = `${100 * y}%`;

  const outgoing = { selector: 'position', data: [x, y] };
  const str = JSON.stringify(outgoing);
  socket.send(str);
}

function onPointerStart(e) {
  const x = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
  const y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
  mouseIsDown = true;
  setPosition(x, y);
}

function onPointerMove(e) {
  if (mouseIsDown) {
    const x = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    const y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
    setPosition(x, y);
  }
}

function onPointerEnd() {
  mouseIsDown = false;
}

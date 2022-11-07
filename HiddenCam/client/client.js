
var fps = 0;
var timerFrequency = 0;
var animationFrequency = 0;

if ('serviceWorker' in navigator) navigator.serviceWorker.register("sw.js");

var worker = new Worker("worker.js");

// Prepare some info
let client = {
  display: getDisplay(),
  visibility: getVisibility(),
  name: navigator.vendor
}


// Socket IO
var socket = io("");
socket.on('connection', (s) => {
    console.log('connected');
    s.on('disconnect', () => {
      console.log('user disconnected');
    });
});

var startTime = performance.now();
// Send data every half a second
setInterval(() => {
  socket.emit('data', {
    client: client,
    fps: fps,
    timer: timerFrequency,
    animation: animationFrequency,
    timestamp: Math.round(performance.now()-startTime)/1000
  })
}, 500)

// Log-in
setTimeout(() => {
  socket.emit('hello client');
}, 1000);


// Helpers
var countFrames = 0;
var countTimer = 0;
var countAnimation = 0;
function loop() {
  countFrames++;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


var lastTime = startTime;
setInterval(() => {
  countTimer++
  var newTime = Math.round(performance.now()-startTime)/1000;
  // document.title = newTime + "s (+" + (newTime-lastTime) + "s)";
  lastTime = newTime;
}, 100);

setInterval(()=> {
  fps = countFrames;
  timerFrequency = countTimer;
  animationFrequency = countAnimation;
  countFrames = 0;
  countTimer = 0
  countAnimation = 0;
}, 1000);
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#box").addEventListener("animationiteration", () => countAnimation++ )
  document.querySelector("input").addEventListener("change", (event) => client.name = document.querySelector("input").value )
  
})


function getVisibility() {
  if (document.visibilityState === 'hidden') {
      return 'hidden';
  }
  return 'visible';
}

['visibilitychange', 'resume'].forEach((type) => {
  window.addEventListener(type, () => client.visibility = getVisibility(), {capture: true});
});

window.addEventListener('freeze', () => {
  client.visibility = 'frozen';
});

function getDisplay() {
  if (matchMedia('display-mode: standalone').matches) return "standalone";
  if (matchMedia('display-mode: fullscreen').matches) return "fullscreen";
  if (matchMedia('display-mode: minimal-ui').matches) return "minimal-ui";
  return "browser";
}

async function sync() {
    let reg = await navigator.serviceWorker.ready;
    reg.sync.register("sync");
}

startPeriodicSync()

async function startPeriodicSync() {
  await periodicPermission();
  await registerPeriodicSync();
}

async function periodicPermission() {
  if ('permissions' in navigator) {
      const permissionStatus = await navigator.permissions.query({
          name: 'periodic-background-sync',
      });
      if (permissionStatus.state === 'granted') {
          console.log('periodic-sync granted');
      } else {
          console.log('periodic-sync denied');
      }    
  } else {
      console.log ('periodic-sync not available');
  }
}

async function registerPeriodicSync() {
  const registration = await navigator.serviceWorker.ready;
  if ('periodicSync' in registration) {
      try {
          await registration.periodicSync.register('sync-tag', {
              minInterval: 120 * 1000 // Two minute
          });
          console.log('periodic-sync registered!');
      } catch (error) {
          console.log('periodic-sync error while registering');
      }
  } else {
    console.log('periodic-sync not available');
  }
}

function workerBlock() {
  worker.postMessage("block")
}

async function swBlock() {
  // var sw = await navigator.serviceWorker.ready;
  navigator.serviceWorker.controller.postMessage("block")
}

 function swWaitUntil() {
  // var sw = await navigator.serviceWorker.ready;
  navigator.serviceWorker.controller.postMessage("wait")
}
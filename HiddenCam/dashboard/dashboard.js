var timeout = 2000;

var socket = io();
socket.on('connection', (socket) => {
    console.log('connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
      document.querySelector("output").innerHTML = "disconnected";
    });
    socket.on('error', () => {
        document.querySelector("output").innerHTML = "disconnected";
    })
});

let timerPageOffline;
function pageOffline() {
    document.querySelector("#client .status").style.background = "darkred";
    document.querySelector("#client .status").innerHTML = 
            document.querySelector("#client .status").innerHTML.replace('Live', 'Stopped at');
    document.querySelector("#client").style.opacity = 0.7;
    innerHTML.replace('Live', 'Stopped at');
}
socket.on('data', data => {
    clearTimeout(timerPageOffline);
    timerPageOffline = setTimeout(pageOffline, timeout);
    document.querySelector("#client").style.opacity = 1;
    document.querySelector("h1").innerHTML = data.client.name;
    document.querySelector("#client .status").style.background = "green";
    document.querySelector("#client .status").innerHTML = `Live <time>${time(data.timestamp)}</time>`;
    document.querySelector("#client .visibility").innerHTML = data.client.visibility;
    document.querySelector("#client .visibility").style.background = 
        data.client.visibility=="visible" ? "green" : "black";
    document.querySelector("#client .display").innerHTML = data.client.display;
    document.querySelector("#fps").dataset.value = data.fps;
    document.querySelector("#timer").dataset.value = Math.min(data.timer/10*100, 100);
    document.querySelector("#animation").dataset.value = data.animation;

    // document.querySelector("output").innerHTML = JSON.stringify(data).split(',"').join('<br>"');
});

let timerSWOffline;
let timerWorkerOffline;
function swOffline() {
    document.querySelector("#serviceworker .status").style.background = "darkred";
    document.querySelector("#serviceworker .status").innerHTML = document.querySelector("#serviceworker .status").innerHTML.replace('Live', 'Stopped at');
    document.querySelector("#serviceworker").style.opacity = 0.7;

}
function workerOffline() {
    document.querySelector("#worker .status").style.background = "darkred";
    document.querySelector("#worker .status").innerHTML = document.querySelector("#worker .status").innerHTML.replace('Live', 'Stopped at');
    document.querySelector("#worker").style.opacity = 0.7;
}

socket.on('data-sw', data => {
    clearTimeout(timerSWOffline);
    timerSWOffline = setTimeout(swOffline, timeout);
    document.querySelector("#serviceworker").style.opacity = 1;
    document.querySelector("#serviceworker .status").style.background = "green";
    document.querySelector("#serviceworker .status").innerHTML = `Live <time>${time(data.timestamp)}</time>`;
    document.querySelector("#swtimer").dataset.value = Math.min(data.timer/20*100, 100);

})
socket.on('data-worker', data => {
    clearTimeout(timerWorkerOffline);
    timerWorkerOffline = setTimeout(workerOffline, timeout);
    document.querySelector("#worker").style.opacity = 1;
    document.querySelector("#worker .status").style.background = "green";
    document.querySelector("#worker .status").innerHTML = `Live <time>${time(data.timestamp)}</time>`;
    document.querySelector("#workertimer").dataset.value = Math.min(data.timer/20*100, 100);

})
setTimeout(() => {
    socket.emit('hello dashboard');
}, 1000)

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
function time(ts) {
    return Math.floor(ts/60).pad() + ":" + Math.round(ts%60).pad();
}
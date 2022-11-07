let countTimer = 0;
let timer = 0;
let initialTime = performance.now();
setInterval(()=>countTimer++, 50);
setInterval(()=>{ 
    timer = countTimer; 
    countTimer=0 
}, 1000);


setInterval(()=> {
    let ts = Math.round(performance.now()-initialTime)/1000;
    fetch("/sw-ping?t=" + timer + "&ts=" + ts)
}, 500);

self.addEventListener("sync", () => {})
self.addEventListener("fetch", () => {})
self.addEventListener("periodicsync", () => {})


self.addEventListener("message", event => {
    if (event.data=="block") {
        while (true) {}
    } else {
        event.waitUntil(new Promise((a, b) => {})) // Promise that never returns
    }
})

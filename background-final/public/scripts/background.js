// Page Visibility API
let backgroundInitialTime;
window.addEventListener('visibilitychange', event => {
    if (document.visibilityState === 'hidden') {
        const now = new Date().toLocaleTimeString();
        log(`Going to the background at ${now}`);
        backgroundInitialTime = performance.now();
    } else {
        const timeElapsed = parseInt((performance.now()-backgroundInitialTime)/1000);
        log(`Back from the background after ${timeElapsed}s`);
    }
});

// Beacon
document.getElementById("btnBeacon").addEventListener("click", event => {
    const data = { message: "Hey from the browser! "};
    const blob = new Blob([JSON.stringify(data)], {type : "application/json"}); 
    navigator.sendBeacon('/log', blob);
});

// Background Sync
document.getElementById("btnSync").addEventListener("click", async event => {
    if ('SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        registration.sync.register("sync");
    } else {
        log("Background sync not available")
    }
});

// Background Periodic Sync
document.getElementById("btnPeriodicSync").addEventListener("click", async event => {
    const registration = await navigator.serviceWorker.ready;
    if ('periodicSync' in registration) {
        const permissionStatus = await navigator.permissions.query({
            name: 'periodic-background-sync',
        });
        if (permissionStatus.state === 'granted') {
            log("Periodic Background Sync granted")
        } else {
            log("Periodic Background Sync denied")
        }

        try {
            await registration.periodicSync.register('periodic', {
                minInterval: 24 * 60 * 60 * 1000 // One day
            });
            log("Periodic Background Sync registered")

        } catch (error) {
            log("Periodic Background Sync not registered")
         }
    } else {
        log("Periodic Background Sync not available");
    }
});

// Background Fetch
document.getElementById("btnFetch").addEventListener("click", async event => {
    const registration = await navigator.serviceWorker.ready;
    if ('backgroundFetch' in registration) {
        const fetch = await registration.backgroundFetch.fetch(   
            "media", ["/media/audio.mp3", "/media/video.mp4"], {
                title: 'Frontend Masters Media files',
                icons: [
                    { 
                        src:'/media/thumb.png',
                        sizes: "800x800", 
                        type:'image/png'
                    }
                ],
        });
        log("Background Fetch registered");
    } else {
        log("Background Fetch not available");
    }
});

// Media playing
document.getElementById("btnPlay").addEventListener("click", event => {
    document.querySelector("audio").play();
    navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Too Much Funk',
        artist: 'Steve Oaks',
        album: 'Frontend Masters Greatest Hits',
        artwork: [ {
            src: "/media/thumb.png",
            type: "image/png",
            sizes: "800x800"
        } ]
    });
});
document.getElementById("btnStop").addEventListener("click", event => {
    document.querySelector("audio").pause();    
});

// PiP
document.getElementById("btnPiP").addEventListener("click", event => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        document.querySelector("video").requestPictureInPicture();
    }
});

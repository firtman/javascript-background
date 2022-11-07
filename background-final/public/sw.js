self.addEventListener('pushsubscriptionchange', function() {
    // do something, usually resubscribe to push and
    // send the new subscription details back to the
    // server via XHR or Fetch
  })

self.addEventListener('notificationclose', function(event) {
    // Useful for tracking
});

self.addEventListener('notificationclick', function(event) {
  // optional data sent with the notification
  var notificationData = event.notification.data;

  if (!event.action) {
    console.log('Notification Click with no action');
    return;
  } else {
    // event action has the action id
    if (event.action=="action-yes") {
        // fetch('/save/yes');
    } else if (event.action=="action-no") {
        // fetch('/save/no');        
    } 
  }
  event.notification.close();

  event.waitUntil(self.clients.matchAll().then(function(clientList) {
    console.log("There are " + clientList.length + " client(s)");
    if (clientList.length > 0) {
        return clientList[0].focus();
    } 
    return self.clients.openWindow('/?params=' + event.notification.data);
}));

});



self.addEventListener("push", function(event) { 
    console.log("Received a push message", event);    
    if (event.data) {
        // Payload data available, we notify directly
        console.log(event.data.json().customData);
        event.waitUntil(showNotification(event.data.json().text));
    } else {
        // Payload not available, we need to download the message somehow (fetch?)        
        // if not, we must show a generic notification
        event.waitUntil(showNotification("We have something new for you"));
    }
});


function showNotification(text) {
    self.registration.showNotification("Frontend Masters", {
        body: text,
        // dir: "auto|rtl|ltr",
        actions: [
          {
            action: 'action-yes',
            title: 'Yes',
            icon: 'http://localhost:4000/images/action_yes.png' 
          },
          {
            action: 'action-no',
            title: 'No',
            icon: 'http://localhost:4000/images/action_no.png' 
          }
        ],
        icon: "http://localhost:4000/images/icon.png",
        badge: "http://localhost:4000/images/badge.png",
        // image: "https://...",      
        vibrate: [100,50,100,50,100],
        // sound: "https://",        
        tag: "notification-id-tag",
        data: "???",
        timestamp: 2342342343,      
        requireInteraction: true,      
        renotify: true,
        silent: false,
      }
    );       
}
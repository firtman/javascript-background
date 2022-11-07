var app = require('express')();
var url = require('url');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors')
app.use(cors())

app.get('/sw-ping', (req, res) => {
    if (dashboard) {
        dashboard.emit('data-sw', { timer: req.query.t, timestamp: req.query.ts });
    }
    res.send("true");
    res.end();
});

app.get('/worker-ping', (req, res) => {
  if (dashboard) {
      dashboard.emit('data-worker', { timer: req.query.t, timestamp: req.query.ts });
  }
  res.send("true");
  res.end();
});

app.use('/', require('express').static('client'));
app.use('/dashboard', require('express').static('dashboard'));

let client;
let dashboard;

io.on('connection', socket => {
  socket.on('hello client', msg => {
    console.log('Client connected');  
    client = socket;
  })
  socket.on('data', msg => {
    if (dashboard) {
        dashboard.emit('data', msg);
    }
  })  
  socket.on('hello dashboard', msg => {
    console.log('Dashboard connected');  
    dashboard = socket;
  })  
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
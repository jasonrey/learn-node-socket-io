var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('./public'));

app.get('/', function(req, res, next) {
    res.render('index');
});

app.set('port', process.env.PORT || 3000);

var connections = {};

io.on('connection', function(socket) {
    if (!connections[socket.id]) {
        connections[socket.id] = {
            name: '',
            socket: socket
        };
    }

    console.log(socket.id + ' connected.');

    socket.on('registerName', function(name) {
        console.log(socket.id + ' has registered as ' + name + '.');

        connections[socket.id].name = name;

        socket.emit('welcome', 'Welcome ' + name + '.');
    });

    socket.on('sendMessage', function(msg) {
        io.emit('broadcastMessage', {
            name: connections[socket.id].name,
            msg: msg
        });
    });
});

http.listen(app.get('port'));
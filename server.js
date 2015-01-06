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

var connections = {},
    map = {};

io.on('connection', function(socket) {
    if (!connections[socket.id]) {
        connections[socket.id] = {
            name: '',
            socket: socket
        };
    }

    socket.on('disconnect', function() {
        delete map[connections[socket.id].name];
        delete connections[socket.id];
    });

    console.log(socket.id + ' connected.');

    socket.on('registerName', function(name, callback) {
        if (map[name]) {
            return callback(false, 'Name has been taken.');
        } else {
            callback(true);
        }

        console.log(socket.id + ' has registered as ' + name + '.');

        connections[socket.id].name = name;
        map[name] = socket.id;

        socket.emit('welcome', 'Welcome ' + name + '.');

        socket.broadcast.emit('join', name + ' has joined the room.');
    });

    socket.on('sendMessage', function(msg) {
        io.emit('broadcastMessage', {
            name: connections[socket.id].name,
            msg: msg
        });
    });

    socket.on('whisper', function(name, msg) {
        if (!map[name]) {
            return;
        }

        var target = connections[map[name]].socket;

        target.emit('whisperReceive', connections[socket.id].name, msg);
        socket.emit('whisperSend', connections[socket.id].name, name, msg);
    });
});

http.listen(app.get('port'));

$(function() {
    var socket,
        name,
        initSocket = function() {
            socket.on('welcome', function(msg) {
                $('.lines').append('<li>' + msg + '</li>');
            });

            socket.on('join', function(msg) {
                $('.lines').append('<li>' + msg + '</li>');
            });

            socket.on('broadcastMessage', function(result) {
                $('.lines').append('<li>' + result.name + ': ' + result.msg + '</li>');
            });

            socket.on('whisperSend', function(name, to, msg) {
                $('.lines').append('<li class="whisper">' + name + ' > ' + to + ': ' + msg + '</li>');
            });

            socket.on('whisperReceive', function(name, msg) {
                $('.lines').append('<li class="whisper">' + name + ': ' + msg + '</li>');
            });
        }

    $('form').on('submit', function(event) {
        event.preventDefault();

        $('.popup button').click();
    });

    $('.popup button').on('click', function() {
        name = $('.popup input').val();

        $('.form-group').find('.alert').remove();

        if (name) {
            socket = io();

            socket.emit('registerName', name, function(success, msg) {
                if (success) {
                    initSocket();

                    $('.popup').remove();
                } else {
                    $('.form-group').prepend('<div class="alert alert-danger">' + msg + '</div>');
                }
            });
        } else {
            $('.form-group').prepend('<div class="alert alert-danger">Name is needed.</div>');
        }
    });

    $('.input').on('keydown', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();

            var input = $(this),
                text = input.text();

            input.text('');

            if (text.substr(0, 1) === '>') {
                var splitted = text.split(' '),
                    target = splitted.splice(0, 1)[0].substr(1),
                    text = splitted.join(' ');

                socket.emit('whisper', target, text);
                return;
            }

            socket.emit('sendMessage', text);
        }
    });
});

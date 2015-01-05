$(function() {
    var socket,
        name,
        initSocket = function() {
            socket.on('welcome', function(msg) {
                $('.lines').append('<li>' + msg + '</li>');
            });

            socket.on('broadcastMessage', function(result) {
                $('.lines').append('<li>' + result.name + ': ' + result.msg + '</li>');
            });
        }

    $('form').on('submit', function(event) {
        event.preventDefault();

        $('.popup button').click();
    });

    $('.popup button').on('click', function() {
        name = $('.popup input').val();

        if (name) {
            socket = io();

            socket.emit('registerName', name);

            initSocket();

            $('.popup').remove();
        }
    });

    $('.input').on('keydown', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();

            socket.emit('sendMessage', $(this).text());

            $(this).text('');
        }
    });
});
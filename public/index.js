$(function() {
    var socket,
        name;

    $('.popup button').on('click', function() {
        name = $('.popup input').val();

        if (name) {
            socket = io();

            $('.popup').remove();
        }
    });
});

$( document ).ready(function() {
    var socket = io();
    console.log('cbob');
    console.log(1);
    socket.on('message', message => {console.log(message)})


    $("#send").click(() => {
        console.log($("#message").val())

        socket.emit('message', $("#message").val())
    })
});



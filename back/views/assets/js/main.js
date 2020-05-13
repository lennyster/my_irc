
$( document ).ready(function() {
    var socket = io();
    console.log('cbob');
    console.log(1);
    socket.on('message', message => {console.log(message)})


    let chatmessages = [];

    $("#send").click(() => {
        console.log($("#message").val())

        socket.emit('chatmessage', $("#message").val())
        chatmessages.push($("#message").val());
    })


    socket.on('chatmessage', message => {
        console.log(message)
        chatmessages.push(message);
    })
});



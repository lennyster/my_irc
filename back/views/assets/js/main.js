
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
        chat();
        $("#message").val('');
    })


    socket.on('chatmessage', message => {
        console.log(message)
        chatmessages.push(message);
        chat();
    })


    socket.on('previousmessages', message => {
        console.log(message)

        chatmessages = message;
        chat();
    })

    function chat(){
        $("#chat").empty();
        chatmessages.map(e => {
            $("#chat").append('<li>'+e+'</li>')
        })
    }
});



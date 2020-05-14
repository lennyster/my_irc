
$( document ).ready(function() {

    let inputUsername = document.body.querySelector("#modalUsername");
    $("#start").click(function(e){
        e.preventDefault();
        if (inputUsername.value.length > 2) {
            socket.emit('setUsername', inputUsername)
        }
    })

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
        $("#message").val("");
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

$(document).ready(function(){
    $(".mask").addClass("active");
  });




  function closeModal(){
    $(".mask").removeClass("active");
  }
  
  // Call the closeModal function on the clicks/keyboard
  
  $(".close, .mask").on("click", function(){
    closeModal();
  });
  
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closeModal();
    }
  });
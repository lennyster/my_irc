
$( document ).ready(function() {
    
    $(".mask").addClass("active");
        


    $("#start").click(function(e){
        e.preventDefault();
        testname();
    })

    $(document).on("keyup", function(e) {
        if($('.mask').hasClass('active') && event.keyCode === 13){
            e.preventDefault();
            testname();
        }
    });


    


    function testname(){
        let inputUsername = $("#modalUsername").val(),
        username,
        allUsers
        inputUsername = $.trim(inputUsername)
        if (inputUsername.length > 1) {
            socket.emit('setUsername', inputUsername)
            socket.on('acceptUsername', (_username, _allUsers) => {
                allUsers = _allUsers;
                console.log(allUsers);
                username = _username;
                closeModal();
            })
            socket.on('rejectUsername', (_username) => {
                $("#modalUsername").val("");
                $("#modalUsername").attr('placeholder', "Username already taken")
            })
        }
    }

    var socket = io();
    console.log('cbob');
    console.log(1);
    socket.on('message', message => {console.log(message)})
    let chatmessages = [];

    $("#send").click(() => {
        console.log(test);
        if($("#message").val() !== ''){
            console.log($("#message").val())
            socket.emit('chatmessage', $("#message").val())
            chatmessages.push($("#message").val());
            chat();
            $("#message").val("");
            $('#message').focus();
        }
    })

    $('#message').on("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if($("#message").val() !== ''){
                console.log($("#message").val())
                socket.emit('chatmessage', $("#message").val())
                chatmessages.push($("#message").val());
                chat();
                $("#message").val("");
                $('#message').focus();
            }
        }
    });


    socket.on('chatmessage', message => {
        console.log(message)
        chatmessages.push(message);
        chat();
    })
    socket.on('server', message => {
        console.log(message)
        chatmessages.push(message);
        chat();
    })

    socket.on('previousmessages', message => {
        console.log(message)

        chatmessages = message;
        chat();
    })

    socket.on('privatemsg', message => {
        console.log(message)
        chatmessages.push(message);
        chat();
    })

    function chat(){
        $("#chat").empty();
        chatmessages.map(e => {
            $("#chat").append('<li>'+e+'</li>')
        })
    }
});



    




  function closeModal(){
    $(".mask").removeClass("active");
  }
  
  // Call the closeModal function on the clicks/keyboard
  
  $(".close, .mask").on("click", function(){
    closeModal();
  });

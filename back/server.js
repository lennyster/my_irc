var express = require('express');
var socketio = require('socket.io');
var app = express();

var http = require('http').createServer(app);

var morgan = require('morgan');
app.use(morgan('dev'))

const io = socketio(http);

let options = {
    root: __dirname + '/views'
}

app.use(express.static(options.root))

app.get("/", (req, res, next) => {
    res.sendFile("index.html", options)

})

let chatmessage = [];


io.on('connection', socket => {
    console.log('Nouvelle connection');
    socket.emit('message','Connection recu');
    socket.emit('previousmessages', chatmessage);
    //envoi a tout le monde sauf socket
    socket.broadcast.emit('message','Quelqu\'un s\'est connecte')


    socket.on('chatmessage', message => {
        console.log(message);
        chatmessage.push(message);
        socket.broadcast.emit('chatmessage',message);

    });

    //deconnection
    socket.on('disconnect', () => {
        io.emit('message','Quelqu\'un s\'est deconnecte')
    });

})

io.on('testmessage', message => {
    console.log(message);
})

let port = 4242; 
http.listen(port, 
    () => console.log("Server sur " + port)
)
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

app.get("/", (req, res, next) => {
    res.sendFile("index.html", options)

})

io.on('connection', socket => {
    console.log('Nouvelle connection');
    socket.emit('message','Connection recu');
})


let port = 4242; 
http.listen(port, 
    () => console.log("Server sur " + port)
)
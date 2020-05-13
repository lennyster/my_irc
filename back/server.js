var express = require('express');
var socketio = require('socketio');
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

let port = 4242; 
app.listen(port, () => console.log("Server sur " + port))
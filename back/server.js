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


let commandes = {
    nick : function (value,socket){
        console.log('Change son pseudo en '+value);
    },
    list : function (value,socket){
        console.log('Check les channel contenant '+value);
    },
    create : function (value,socket){
        console.log('Creer un channel s\'appelant '+value);
    },
    delete : function (value,socket){
        console.log('supprime le channel s\'appelant '+value);
    },
    join : function (value,socket){
        console.log('Rejoin le channel '+value);
    },
    part : function (value,socket){
        console.log('Quitte le channel '+value);
    },
    users : function (value,socket){
        console.log('Liste les utilisateurs '+value);
    },
    msg : function (value,socket){
        console.log('Envoi un message a '+value);
    },
};







io.on('connection', socket => {
    console.log('Nouvelle connection');
    socket.emit('message','Connection recu');
    socket.emit('previousmessages', chatmessage);
    //envoi a tout le monde sauf socket
    socket.broadcast.emit('chatmessage','Quelqu\'un s\'est connecte')


    socket.on('chatmessage', message => {
        if( message.substr(0,1) == "/"){
            // console.log('commande');
            message = message.substr(1);
            let tab = message.split(" ");
            // console.log(tab);
            let key = tab[0];
            if(commandes[key] === undefined){
                console.log('je ne connais pas cette commande');
            } else {
                console.log('commande reconnu')
                tab.shift();
                let value = tab.join(' ');
                commandes[key](value,socket);

            }
        } else {
            chatmessage.push(message);
            socket.broadcast.emit('chatmessage',message);
        }
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
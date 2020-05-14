var express = require('express');
var socketio = require('socket.io');
var app = express();

var http = require('http').createServer(app);

var morgan = require('morgan');
app.use(morgan('dev'))

const io = socketio(http);

let Users = [];

let username;

let options = {
    root: __dirname + '/views'
}

app.use(express.static(options.root))

app.get("/", (req, res, next) => {
    res.sendFile("index.html", options)

})

let chatmessage = [];


let commandes = {
    nick : function (value,tab,socket){
        console.log('Change son pseudo en '+value);
    },
    list : function (value,tab,socket){
        console.log('Check les channel contenant '+value);
    },
    create : function (value,tab,socket){
        console.log('Creer un channel s\'appelant '+value);
    },
    delete : function (value,tab,socket){
        console.log('supprime le channel s\'appelant '+value);
    },
    join : function (value,tab,socket){
        console.log('Rejoin le channel '+value);
    },
    part : function (value,tab,socket){
        console.log('Quitte le channel '+value);
    },
    users : function (value,tab,socket){
        console.log('Liste les utilisateurs '+value);
    },
    msg : function (value,tab,socket){
        let tab2 = tab;
        let pseudo = tab2[0];
        tab.shift();
        let msg = tab.join(' ');
        console.log('Envoi un message a '+pseudo+' Contenant ce message: '+msg);
    },
};







io.on('connection', socket => {
    //socket.broadcast.emit('chatmessage','Quelqu\'un s\'est connecte')
    console.log('Nouvelle connection: ' + socket.id);
    // Traitement pour l'assignation d'un Username
    socket.on('setUsername', (inputUsername) => {
        let usernameAlreadyExists = false;
        for(let socketid in Users){
            if (Users[socketid] == inputUsername) {
                usernameAlreadyExists = true;
            }
        }

        if (usernameAlreadyExists) {
            console.log('Decline')
            socket.emit('rejectUsername', inputUsername)
        }
        else {
            console.log(inputUsername)
            console.log('Accept')
            socket.join('users', () => {
                socket.emit('acceptUsername', inputUsername, Usernames())
                Users[socket.id] = inputUsername; 
                //socket.broadcast.emit('chatmessage','Quelqu\'un s\'est connecte')
            })
        }
    })
    socket.emit('message','Connection recu');
    socket.emit('previousmessages', chatmessage);
    //envoi a tout le monde sauf socket
    socket.broadcast.emit('chatmessage','Quelqu\'un s\'est connecte')


    socket.on('chatmessage', message => {
        // LES COMMANDES
        if( message.substr(0,1) == "/"){
            // console.log('commande');
            message = message.substr(1);
            let tab = message.split(" ");
            // console.log(tab);
            let key = tab[0];
            if(commandes[key] === undefined){
                console.log('je ne connais pas cette commande');
                socket.emit('chatmessage','SERVER : je ne connais pas cette commande')
            } else {
                console.log('commande reconnu')
                tab.shift();
                let value = tab.join(' ');
                commandes[key](value,tab,socket);

            }
        } else {
            chatmessage.push(message);
            socket.broadcast.emit('chatmessage',message);
        }
    });

socket.on('edit', () => {

})

    //deconnection
    socket.on('disconnect', () => {
        io.emit('message','Quelqu\'un s\'est deconnecte')
        console.log("Déconnexion: "+ socket.id)
        if (Users[socket.id]) {
            console.log(Users[socket.id] + ", bye !")
            delete Users[socket.id]

        }
    });

})

io.on('testmessage', message => {
    console.log(message);
})

let port = 4242; 
http.listen(port, 
    () => console.log("Server sur " + port)
)

// Renvoie username sans index

function Usernames(){
    let usernames = [];
    for(let socketid in Users){
        usernames.push(Users[socketid])
    }
    return usernames;
}

function UpdateUsers(users){
      
}
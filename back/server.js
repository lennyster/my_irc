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
let rooms = [];

let commandes = {
    nick : function (value,tab,socket){
        let usernameAlreadyExists = false;
        for(let socketid in Users){
            if (Users[socketid] == value) {
                usernameAlreadyExists = true;
            }
        }
        if(usernameAlreadyExists === true){
            socket.emit('server','SERVER : le pseudo "'+value+'" est deja prit');

        } else {
            let previous = Users[socket.id];
            Users[socket.id] = value;
            console.log(Users[socket.id])
            console.log('Change son pseudo en '+value);
            socket.broadcast.emit('server','SERVER : '+previous+ ' change son pseudo en '+Users[socket.id])
        }
    },
    list : function (value,tab,socket){
        console.log('Check les channel contenant '+value);
    },
    create : function (value,tab,socket){
        let created = false;
        let room = tab.join(' ');
        for(x in rooms){
            if(x == room){
                created = true;
            }
        }

        if(!created){
            let lastroom;
            for(x in socket.rooms){
                if(x !== socket.id){
                    lastroom = x;
                }
            }
            console.log(lastroom,socket.rooms);
            
            socket.join(room);
            socket.leave(lastroom);
            rooms[room] = { owner: socket.id, createdat : Date.now(), users : []};
            rooms[room].users.push(Users[socket.id]);
            // io.sockets.manager.roomClients[socket.id]
            io.emit('server','SERVER : '+Users[socket.id]+ ' creer le channel '+room);
            console.log(rooms);



            console.log('Creer un channel s\'appelant '+value);
        } else {
            socket.emit('server','SERVER : le channel "'+value+'" est deja prit');
        }
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
        let array = [];
        for(let x in Users){
            array.push(Users[x]);
        }
        socket.emit('server',array);
    },
    msg : function (value,tab,socket){
        let tab2 = tab;
        let pseudo = tab2[0];
        tab.shift();
        let msg = tab.join(' ');
        let id = null;
        for(let x in Users){
            if(Users[x] === pseudo){
                id = x;
            }
        }
        if(id === null){
            socket.emit('server','SERVER : le pseudo "'+pseudo+'" n\'existe pas');
        } else {
            console.log(id);
            io.to(id).emit('privatemsg', 'FROM : '+Users[socket.id]+'\t'+msg);
        }
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
                socket.broadcast.emit('server','SERVER :'+Users[socket.id] + ' s\'est connecte')
            })
        }
    })
    socket.emit('message','Connection recu');
    socket.emit('previousmessages', chatmessage);
    //envoi a tout le monde sauf socket
    //dawhihdawio

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
                socket.emit('server','SERVER : je ne connais pas cette commande')
            } else {
                console.log('commande reconnu')
                tab.shift();
                let value = tab.join(' ');
                commandes[key](value,tab,socket);

            }
        } else {
            chatmessage.push(Users[socket.id]+': '+message);
            let currentroom;
            for(x in socket.rooms){
                if(x !== socket.id){
                    currentroom = x;
                }
            }
            console.log(currentroom);
            socket.broadcast.to(currentroom).emit('chatmessage',Users[socket.id]+': '+message);
            // socket.broadcast.emit('chatmessage',Users[socket.id]+': '+message);
        }
    });

socket.on('edit', () => {

})

    //deconnection
    socket.on('disconnect', () => {
        socket.broadcast.emit('server','SERVER : '+Users[socket.id] + ' s\'est deconnecte')
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
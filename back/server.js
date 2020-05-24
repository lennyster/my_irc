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
rooms['users'] = { owner: null, createdat : Date.now(), users : [],messages : []};

let commandes = {
    nick : function (value,tab,socket){
        let usernameAlreadyExists = false;
        for(let socketid in Users){
            if (Users[socketid] == value) {
                usernameAlreadyExists = true;
            }
        }
        if(usernameAlreadyExists === true){
            let msg = 'le pseudo "'+value+'" est deja prit';
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'})

        } else {
            let previous = Users[socket.id];
            Users[socket.id] = value;
            console.log(Users[socket.id])
            console.log('Change son pseudo en '+value);
            let msg = previous+ ' change son pseudo en '+Users[socket.id]
            // socket.broadcast.emit('server','SERVER : '+previous+ ' change son pseudo en '+Users[socket.id])
            socket.broadcast.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'})

        }
    },
    list : function (value,tab,socket){
        let array = [];
        for(let x in rooms){
            array.push(x);
        }
        // socket.emit('server','SERVER : les channels disponibles sont : '+ array);
        let msg = 'les channels disponibles sont : '+ array;
        socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'})

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
            rooms[room] = { owner: socket.id, createdat : Date.now(), users : [], messages : []};
            rooms[room].users.push(Users[socket.id]);
            removeA(rooms[lastroom].users, Users[socket.id]);

            // io.sockets.manager.roomClients[socket.id]
            // io.emit('server','SERVER : '+Users[socket.id]+ ' creer le channel '+room);
            let msg = Users[socket.id]+ ' creer le channel '+room;
            io.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'});

            console.log(rooms);



            console.log('Creer un channel s\'appelant '+value);
        } else {
            // socket.emit('server','SERVER : le channel "'+value+'" est deja prit');
            let msg = 'le channel "'+value+'" est deja prit';
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

        }
    },
    delete : function (value,tab,socket){
        let room = tab.join(' ');
        let created = false;
        for(x in rooms){
            if(x == room){
                created = true;
            }
        }

        if(created){
            let lastroom;
            for(x in socket.rooms){
                if(x !== socket.id){
                    lastroom = x;
                }
            }
            if(rooms[lastroom].owner == socket.id){
                var clients_in_the_room = io.sockets.adapter.rooms[lastroom].sockets; 
                for (var clientId in clients_in_the_room ) {
                // console.log('client: %s', clientId); //Seeing is believing 
                var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
                client_socket.leave(lastroom);
                client_socket.join('users');
                // client_socket.emit('server','SERVER : vous avez ete reconnecte au channel users');
                let msg = 'vous avez ete reconnecte au channel users';
                client_socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

                rooms['users'].users.push(Users[client_socket.id]);
                }
                delete rooms[lastroom];
                // let test = rooms.splice(lastroom,1);
                // io.emit('server','SERVER : '+Users[socket.id]+ ' delete le channel '+room);
                msg = Users[socket.id]+ ' delete le channel '+room;
                io.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'});


                console.log('Delete le channel '+value);
            } else {
                // socket.emit('server','SERVER : le channel "'+value+'" ne vous appartient pas !');
                let msg = 'le channel "'+value+'" ne vous appartient pas !';
                socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

            }
        } else {
            // socket.emit('server','SERVER : le channel "'+value+'" n\'existe pas');
            let msg = 'le channel "'+value+'" n\'existe pas'
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

        }
    },
    join : function (value,tab,socket){
        let room = tab.join(' ');
        let created = false;
        for(x in rooms){
            if(x == room){
                created = true;
            }
        }

        if(created){
            let lastroom;
            for(x in socket.rooms){
                if(x !== socket.id){
                    lastroom = x;
                }
            }
            console.log(lastroom,socket.rooms);
            
            socket.join(room);
            socket.leave(lastroom);
            removeA(rooms[lastroom].users, Users[socket.id]);
            rooms[room].users.push(Users[socket.id]);
            // io.sockets.manager.roomClients[socket.id]
            // io.emit('server','SERVER : '+Users[socket.id]+ ' rejoint le channel '+room);
            let msg = Users[socket.id]+ ' rejoint le channel '+room;
            io.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'});

            console.log(rooms);
            // socket.broadcast.to(room).emit('server','SERVER : '+Users[socket.id]+ ' vient de rejoindre le channel !');
            msg = Users[socket.id]+ ' vient de rejoindre le channel !';
            socket.broadcast.to(room).emit('chatmessage',{from: 'server', currentchannel: room, message: msg, type: 'public'});



            // console.log('Creer un channel s\'appelant '+value);
            console.log('Rejoint le channel '+value);
        } else {
            // socket.emit('server','SERVER : le channel "'+value+'" n\'existe pas');
            let msg = 'le channel "'+value+'" n\'existe pas';
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

        }
    },
    part : function (value,tab,socket){
        let room = tab.join(' ');
        let created = false;
        for(x in rooms){
            if(x == room){
                created = true;
            }
        }

        if(created){
            let lastroom;
            for(x in socket.rooms){
                if(x !== socket.id){
                    lastroom = x;
                }
            }
            
                
                socket.leave(lastroom);
                socket.join('users');
                // socket.emit('server','SERVER : vous avez ete reconnecte au channel users');
                let msg = 'vous avez ete reconnecte au channel users';
                socket.emit('chatmessage',{from: 'server', currentchannel: 'users', message: msg, type: 'private'});
                removeA(rooms[lastroom].users, Users[socket.id]);
                rooms['users'].users.push(Users[socket.id]);


                // socket.broadcast.to(lastroom).emit('server','SERVER : '+Users[socket.id]+ ' vient de quitter le channel !');
                msg = Users[socket.id]+ ' vient de quitter le channel !';
                socket.broadcast.to(lastroom).emit('chatmessage',{from: 'server', currentchannel: lastroom, message: msg, type: 'public'});


                // socket.broadcast.to('users').emit('server','SERVER : '+Users[socket.id]+ ' vient de rejoindre le channel !');
                msg = Users[socket.id]+ ' vient de rejoindre le channel !';
                socket.broadcast.to('users').emit('chatmessage',{from: 'server', currentchannel: 'users', message: msg, type: 'public'});

            
        } else {
            // socket.emit('server','SERVER : le channel "'+value+'" n\'existe pas');
            let msg = 'le channel "'+value+'" n\'existe pas';
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

        }
    },
    users : function (value,tab,socket){
        let lastroom;
        for(x in socket.rooms){
            if(x !== socket.id){
                lastroom = x;
            }
        }
        let array = [];
        for(let x in rooms[lastroom].users){
            array.push(rooms[lastroom].users[x]);
        }
        // socket.emit('server','SERVER : les personnes connectes sont : '+ array);
        let msg = 'les personnes connectes sont : '+ array;
        socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});

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
            let msg2 = 'le pseudo "'+pseudo+'" n\'existe pas';
            socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg2, type: 'private'});

        } else {
            console.log(id);
            // io.to(id).emit('privatemsg', 'FROM : '+Users[socket.id]+'\t'+msg);

            io.to(id).emit('chatmessage',{from: Users[socket.id], currentchannel: null, message: msg, type: 'private'});
        }
        console.log('Envoi un message a '+pseudo+' Contenant ce message: '+msg);
    },
};

// ENLEVE UNE VALUE DUN TABLEAU
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}




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
                // socket.broadcast.emit('server','SERVER :'+Users[socket.id] + ' s\'est connecte')
                let msg = Users[socket.id] + ' s\'est connecte';
                socket.broadcast.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'});

                rooms['users'].users.push(Users[socket.id]);
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
                // socket.emit('server','SERVER : je ne connais pas cette commande')
                let msg = 'je ne connais pas cette commande';
                socket.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'private'});
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
            // socket.broadcast.to(currentroom).emit('chatmessage',Users[socket.id]+': '+message);
            rooms[currentroom].messages.push({from: Users[socket.id], message : message});
            socket.broadcast.to(currentroom).emit('chatmessage',{from: Users[socket.id], currentchannel: currentroom, message: message, type: 'public'})
            // socket.broadcast.emit('chatmessage',Users[socket.id]+': '+message);
        }
    });

socket.on('edit', () => {

})

    //deconnection
    socket.on('disconnect', () => {
        // socket.broadcast.emit('server','SERVER : '+Users[socket.id] + ' s\'est deconnecte')
        let msg = Users[socket.id] + ' s\'est deconnecte';
        socket.broadcast.emit('chatmessage',{from: 'server', currentchannel: null, message: msg, type: 'public'});
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
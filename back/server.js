var express = require('express');
var app = express();
var morgan = require('morgan');
app.use(morgan('dev'))

let options = {
    root: __dirname + '/views'
}

app.get("/", (req, res, next) => {
    res.sendFile("index.html", options)

})

let port = 4242; 
app.listen(port, () => console.log("Server sur " + port))
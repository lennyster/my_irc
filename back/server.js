var express = require('express');
var app = express();

app.use((req, res, next) => {
    console.log(req.path);
    next();
})
app.get("/:name", (req, res, next) => {
    res.send("Hello "+ req.params.name)

})

let port = 4242; 
app.listen(port, () => console.log("Server sur " + port))
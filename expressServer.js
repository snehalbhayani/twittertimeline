var express = require('express');
var app = express();

app.use(express.static('static/templates'));
app.use(express.static('js'));
app.use(express.static('bower_components'));


app.get('/', function(req, res){
    res.sendFile('/home/snehal/workspace/samplenodejs/static/templates/index.html');
});

app.listen(3000);

var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.sendFile('/home/snehal/workspace/samplenodejs/static/templates/index.html');
});

app.use(express.static('static/templates'));

app.listen(3000);

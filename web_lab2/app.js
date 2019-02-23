const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use('/public', express.static('public'));

server.use(favicon(__dirname + '/public/images/favicon.ico'));
server.set("view engine", "pug");
server.set("views", `./views`);

server.get('/', (req, res)=>{
    res.render('main');
});

const groups = require('./books.js');
server.use('/books', groups);
server.listen(3000);
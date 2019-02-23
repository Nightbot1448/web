const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const privateKey = fs.readFileSync('sslcert/example.key');
const certificate = fs.readFileSync('sslcert/example.crt');

var credentials = {key: privateKey, cert: certificate};
const express = require('express');
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use('/public', express.static('public'));

server.use(favicon(__dirname + '/public/images/favicon.ico'));
server.set("view engine", "pug");
server.set("views", `./views`);

const main = require('./routes/main.js');
server.use('/', main);

const arts = require('./routes/arts.js');
server.use('/arts', arts);

const participants = require('./routes/participants.js');
server.use('/participants', participants);


let httpServer = http.createServer(server);
let httpsServer = https.createServer(credentials, server);

httpServer.listen(3000);
httpsServer.listen(3443);
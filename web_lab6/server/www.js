const app = require('./app');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const debug = require('debug')('web6:server');
var brokersJSON=require("../data/brokers.json");
var spotsJSON=require("../data/spots.json");
let brokers=[];
for (let key in brokersJSON) {
    brokers.push(brokersJSON[key]);
}
let spots=[];
for (let key in spotsJSON) {
    spots.push(spotsJSON[key]);
}
let port = 80;
server.listen(port, ()=>{
    console.log(`HTTP server started at http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

io.sockets.on('connection', (socket) => {
    socket.on('hello', (name) => {
        let brokersJsonSave = {};
        for (let i = 0; i < brokers.length; i++) {
            if(brokers[i].name === name)
                brokers[i].online = true;
            brokersJsonSave[i] = brokers[i];
        }
        writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
        socket["name"] = name;
        socket.broadcast.emit('hello', name);
        console.log(name, "зашел");
    });


    socket.on('BuyStocks', (data) => {
        let brokersJsonSave = {};
        let spotsJsonSave = {};
        for (let i = 0; i < brokers.length; i++) {
            if(brokers[i].name === data.broker){
                brokers[i].acBought[Number(data.id)].count+=Number(data.count);
                brokers[i].currmoney-=Number(data.price*data.count);
            }
            brokersJsonSave[i] = brokers[i];
        }
        for (let i = 0; i < spots.length; i++) {
            if(i === data.id){
                spots[i].availCount -=Number(data.count);
            }
            spotsJsonSave[i] = spots[i];
        }
        writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
        writeToFile('../data/spots.json',JSON.stringify(spotsJsonSave));
        socket.broadcast.emit('BuyStocks', [brokers,spots]);
    });

    socket.on('SellStocks', (data) => {
        let brokersJsonSave = {};
        let spotsJsonSave = {};
        for (let i = 0; i < brokers.length; i++) {
            if(brokers[i].name === data.broker){
                brokers[i].acBought[Number(data.id)].count-=Number(data.count);
                brokers[i].currmoney+=Number(data.price*data.count);
            }
            brokersJsonSave[i] = brokers[i];
        }
        for (let i = 0; i < spots.length; i++) {
            if(i === data.id){
                spots[i].availCount +=Number(data.count);
            }
            spotsJsonSave[i] = spots[i];
        }
        writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
        writeToFile('../data/spots.json',JSON.stringify(spotsJsonSave));
        socket.broadcast.emit('SellStocks', [brokers,spots]);
    });

    socket.on('TradeStocks', (data) => {
        let brokersJsonSave = {};
        let spotsJsonSave = {};
        for (let i = 0; i < brokers.length; i++) {
            if(brokers[i].name === data.broker){
                brokers[i].acBought[Number(data.id)].count-=Number(data.count);
                brokers[i].acForSell[Number(data.id)].count+=Number(data.count);
            }
            brokersJsonSave[i] = brokers[i];
        }
        for (let i = 0; i < spots.length; i++) {
            spotsJsonSave[i] = spots[i];
        }
        writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
        writeToFile('../data/spots.json',JSON.stringify(spotsJsonSave));
        socket.broadcast.emit('TradeStocks', [brokers,spots]);
    });

    socket.on('disconnect', ()=>{
        if (socket['name']) {
            let brokersJsonSave = {};
            for (let i = 0; i < brokers.length; i++) {
                if(brokers[i].name === socket['name']) {
                    brokers[i].online = false;
                    brokers[i].currmoney = brokers[i].startmoney;
                }
                brokersJsonSave[i] = brokers[i];
            }
            writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
            socket.json.emit('disct', socket['name']);
            socket.broadcast.emit('disct', socket['name']);
            console.log(socket['name'], "вышел");
        }
    });
});

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

// handle specific listen errors with friendly messages 
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
function writeToFile(filepath, text) {
    const fs = require("fs");
    fs.writeFile(filepath, text, (err) => {
        if (err) throw err;
        console.log('Saved!');
    });
}
module.exports = server;
// @flow

var express = require('express');
// var getIds = require("debug")('getIds');
var router = express.Router();
const io = require('socket.io').listen(3030);


try {
    var pictures = require("../src/arts_state");
    var participants = require("../src/participants_state");
    var settings = require("../src/settings");
} catch (e) {
    console.error(e);
}

// console.log(bidders);

io.sockets.on('connection', (socket) => {
    let time = (new Date()).toLocaleDateString();
    socket.on('message', (msg) => {
        if (msg.type == 'connect') {
            socket.json.send({"type": "connect", "message": `${time} Добро пожаловать ${msg.name}`});
            socket.broadcast.json.send({"type": "connect", "message": `${time} Присоединился ${msg.name}`})
        }
    });
    socket.emit('hello', state);
    socket.emit('time', sec)

});


var sold = [];
var currentPic;
var gogogo = false;
var Pics = getActivePics();
const pause = settings.pause;
const timeout = settings.timeout;
let end = false;
let sec = 0;
let cur = 0;
let curPrice;
let current_user = 0;

var state = "";
var text = settings.date + " " + settings.time;
var date = new Date(text.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
var now = new Date();
var millisTill10 = 2000; //date - now
if (millisTill10 < 0) {
    state = "Аукцион закрылся"
} else {
    // console.log(`its ${millisTill10} to start`)
    setTimeout(() => {
        console.log('start');

        const intId = setInterval(() => {
            if (!end)
                sec++;
            else
                clearInterval(intId);
            io.sockets.emit('time', sec);
            io.sockets.emit('timeTillEnd', Pics.length * (Number(pause) + Number(timeout)) - sec);
            let cur_time = (cur + 1) * (Number(pause) + Number(timeout)) - sec;
            if (cur_time === 1) {
                if (Pics[cur].sold_to){
                    const sold_to = participants.data.map((e) => {
                        return e.id;
                    }).indexOf(Pics[cur].sold_to);
                    participants.data[sold_to].money -= Pics[cur].sold_for;
                    io.sockets.emit('sub_money', participants.data[sold_to])
                }
                // bidders[sold_to].money -= Pics[cur].sold_for
            }
            data = {next: cur_time, sold: cur_time-1<Number(timeout)};
            io.sockets.emit('timeTillNext', data)
        }, 1000);

        recPromiseForAuc()//rec)
    }, millisTill10);
    state = `Добро пожаловать на аукцион!`
}

function recPromiseForAuc() {
    currentPic = Pics[cur];
    curPrice = currentPic.sold_for;
    io.sockets.emit('nextPic');
    return new Promise((resolve, reject) => {
        gogogo = false;
        console.log('pause');
        io.sockets.emit('pause');
        setTimeout(() => {
            resolve()
        }, pause * 1000)
    }).then(result => {
        gogogo = true;
        io.sockets.emit('start');
        console.log('selling');
        new Promise((resolve, reject) => {
            setTimeout(() => {
                //console.log(Pics.length-1)
                if (cur >= Pics.length - 1)
                    end = true;
                resolve()
            }, timeout * 1000)
        }).then(resolve => {
                if (!end) {
                    cur++;
                    recPromiseForAuc();
                    return false;
                }
                return true;
            }
        ).then(result => {
            if (result) {
                state = "Аукцион закрылся";
                io.sockets.emit('end', state);
                console.log('end')
            }
        })
    }).catch(e => {
        console.log(e);
    })
}

function getActivePics() {
    let data = [];
    for (let pic of pictures.mdata) {
        if (pic.selling)
            data.push(pic)
    }
    return data;
}


router.get('/', function (req, res, next) {
    res.render('log_in');
});


router.get('/admin/:id([0-9]{1,})', function (req, res, next) {
    let id = req.params.id;
    res.render('admin_page', {id: id});
});

router.get('/sold_arts_page/:id([0-9]{1,})', function (req, res, next) {
    let id = req.params.id;
    const resSend = participants.data.map((e) => {
        return parseInt(e.id);
    }).indexOf(parseInt(id));
    if (resSend !== -1)
    {
        res.render('sold_arts_page', {id: id, is_admin: participants.data[resSend].is_admin});
    }
});


router.get('/auction/:id([0-9]{1,})', function (req, res, next) {
    let id = req.params.id;
    const resSend = participants.data.map((e) => {
        return parseInt(e.id);
    }).indexOf(parseInt(id));
    if (resSend !== -1){
        current_user = id;
        // console.log(participants.data[resSend]);
        res.render('auction_page', participants.data[resSend]);
    }
});

router.get('/current_user_id', (req,res)=>{
    res.send(JSON.stringify(current_user));
});

router.post('/current_user_id/:id([0-9]{1,})', (req, res) => {
    current_user = req.params.id;
    res.send();
});

router.get('/bidders/', (req, res) => {
    let mdata = [];
    for (bid of participants.data) {
        if (bid != 0)
            mdata.push(bid)
    }
    // let resSend = {"data": };
    res.send(JSON.stringify(mdata));
});

router.get('/pict/', (req, res) => {
    res.send(JSON.stringify(getActivePics()));
});

router.get('/get_mem/:id([0-9]{1,})', (req, res) => {
    let id = req.params.id;
    const resSend = participants.data.map((e) => {
        return parseInt(e.id);
    }).indexOf(parseInt(id));
    if (resSend != -1){
        // console.log(bidders.data[resSend]);
        res.send(JSON.stringify(participants.data[resSend]));
    }
});

router.get('/loadcur/', (req, res) => {
    //console.log(curentPic.name)
    if (!end) {
        let resSend = {"curPic": currentPic};
        res.send(JSON.stringify(resSend));
    }
});

router.put('/addPrice/:price([0-9]{1,})/:id([0-9]{1,})', (req, res) => {
    const add = Number(req.params.price), id = Number(req.params.id);
    if (gogogo) {
        curPrice += add;
        Pics[cur].sold_for += add;
        Pics[cur].sold_to = id;
        io.sockets.emit('updatePrice',JSON.stringify({'curPrice':curPrice,'added':add}))
    }
    res.status(200);
});

router.put('/soldTo/:id([0-9]{1,})', (req, res) => {
    let id = req.params.id;

    // bidders[resSend].sold_to = resSend;
    sold.push({"Pic": currentPic, "id": id , "price": curPrice});

    //curPrice = 100;
    // io.sockets.emit('sold');
    res.status(200);
});

router.get('/sold/', (req, res) => {
    let sold_arts = [];
    for (let pic of Pics)
    {
        if (pic.sold_to)
            sold_arts.push(pic)
    }
    let resSend = {"sold": sold_arts};
    res.send(JSON.stringify(resSend));
});

router.get('/sold/:id([0-9]{1,})', (req, res) => {
    let sold_arts = [];
    let id = parseInt(req.params.id);
    // console.log('user id', id, typeof(id));
    for (let pic of Pics)
    {
        // console.log(pic.sold_to, typeof(pic.sold_to));
        if (pic.sold_to && pic.sold_to === id)
            sold_arts.push(pic)
    }
    let resSend = {"sold": sold_arts};
    res.send(JSON.stringify(resSend));
});

module.exports = router;

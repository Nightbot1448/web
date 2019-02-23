const express = require('express');
const router = express.Router();
let fs = require("fs");

let settings = require('./auction_settings');

router.get('/auction_settings', (req, res) =>{
    res.render('auction_settings', {settings: settings});
});

router.get('/', (req, res)=>{
    res.render('main');
});

router.post('/', (req, res) =>{
    let body = req.body;
    fs.writeFile('./routes/auction_settings.json', JSON.stringify(body, null, 4), (err) => {
        if (err){
            console.log(err);
            res.status(500).send('incorrect data');
        }
    });
    settings = body;
    res.render('main');
});

module.exports = router;
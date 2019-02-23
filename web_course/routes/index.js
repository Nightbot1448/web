var express = require('express');
var router = express.Router();
let peopleRecords = require('../data/records');
var path = require('path');

/* GET home page. */

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/..' +'/public' +'/views' + '/index.html'));
});

router.get('/game', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/..' +'/public' +'/views' + '/game.html'));
});

router.put('/', function(req, res, next)
{
  if(peopleRecords[req.query.name])
  {
      if(parseInt(peopleRecords[req.query.name]) > parseInt(req.query.record))
      {
          peopleRecords[req.query.name] = req.query.record;
      }
  }
  else
  {
      peopleRecords[req.query.name] = req.query.record;
  }
  res.status(200);
});

router.get('/records/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/..' +'/public' +'/views' + '/records.html'));
});

router.get('/records_info', function(req, res, next)
{
  let recordsPairs = Object.entries(peopleRecords);
  recordsPairs.sort(function(a,b)
  {
      if(parseInt(a[1]) < parseInt(b[1]))
      {
          return -1;
      }
      if(parseInt(a[1]) > parseInt(b[1]))
      {
          return 1;
      }
      else
      {
          return 0;
      }
  });
  console.log(recordsPairs);
  res.send(recordsPairs);
});

module.exports = router;
// console.log(peopleRecords)
module.exports.peopleRecords = peopleRecords;

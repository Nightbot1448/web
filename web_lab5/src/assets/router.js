const express = require("express");
const router = express.Router();

var brokersJSON=require("../data/brokers.json");
var brokers = [];
for (key in brokersJSON) {
  brokers.push(brokersJSON[key]);
}
var akciiJSON=require("../data/stocks.json");
var akcii = [];
for (key in akciiJSON) {
  akcii.push(akciiJSON[key]);
}
var setts=require("../data/settings.json");

router.get("/", (req, res, next)=>{
  res.end("ROOT PAGE");
  next();
});

router.get("/api/broker",(req,res)=>{
  res.status(200);
  res.send(brokers);
});
router.get("/api/trade",(req,res)=>{
  res.status(200);
  res.send(akcii);
});
router.get("/api/setts",(req,res)=>{
  res.status(200);
  res.send(setts);
});

router.put("/api/broker",(req,res)=>{
  brokers = req.body;
  res.status(200);
  let brokersJsonSave = {};
  for (let i = 0; i < brokers.length; i++) {
    brokersJsonSave[i] = brokers[i];
  }
  writeToFile('../data/brokers.json',JSON.stringify(brokersJsonSave));
  res.json();
});
router.put("/api/akcii",(req,res)=>{
  akcii = req.body;
  res.status(200);
  let akciiJsonSave = {};
  for (let i = 0; i < akcii.length; i++) {
    akciiJsonSave[i] = akcii[i];
  }
  writeToFile('../data/stocks.json',JSON.stringify(akciiJsonSave));
  res.json();
});
router.put("/api/setts",(req,res)=>{
  setts = req.body;
  res.status(200);
  writeToFile('../data/settings.json', JSON.stringify(setts));
  res.json();
});

function writeToFile(filepath, text) {
  const fs = require("fs");
  fs.writeFile(filepath, text, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
}
module.exports = router;

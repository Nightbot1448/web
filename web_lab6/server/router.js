const express = require("express");
const router = express.Router();

var brokersJSON = require("../data/brokers.json");
var stocksJSON = require("../data/spots.json");

function getArrayFromObject(obj) {
    let arr = [];
    for (let key in obj) {
        arr.push(obj[key]);
    }
    return arr;
}
router.get("/", (req, res, next)=>{
    res.end("ROOT PAGE");
    next();
});

router.get("/info",(req,res)=>{
    res.status(200);
    res.send({
            brokers:getArrayFromObject(brokersJSON),
            spots: getArrayFromObject(stocksJSON)
        }
    );
});
module.exports = router;
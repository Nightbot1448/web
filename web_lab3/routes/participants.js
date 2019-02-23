const express = require('express');
const router = express.Router();
let fs = require("fs");

let participants = require('./participants_state');

router.get('/:id([0-9]{1,})', (req, res)=>{
    participants.filter((participant)=>{
        if(participant.id === Number(req.params.id)) {
            res.render('participants/participant_info', {participant: participant});
        }
    });
    res.status(404); // Ошибка – нет такой страницы
    res.end("404: Page not found")
});

router.get('/', (req, res)=> {
    res.render('participants/list_of_participants', {participants: participants});
});

router.put('/:id([0-9]{1,})', (req, res) => {
    let body = req.body;
    if (body){
        let update_index = participants.map((art) => {
            return parseInt(art.id)
        }).indexOf(parseInt(req.params.id));

        if (update_index === -1){
            res.json({message: 'Error'})
        }
        if('name' in body){
            participants[update_index].name = body.name;
            participants[update_index].surname = body.surname;
            participants[update_index].cash = body.cash;
            res.json({message: 'success', reload: false})
        }
    }
});

router.put('/', (req, res) => {
    let body = req.body;
    let participant = {};
    if (body.name && body.surname && body.cash){
        participant['id'] = participants[participants.length-1].id+1;
        participant.name = body.name;
        participant.surname = body.surname;
        participant.cash = body.cash;
        participants.push(participant);
        res.json({message: 'success', participant: participant})
    }
    else{
        res.json({message: 'Error', location: '/books'})
    }
});

router.delete('/:id([0-9]{1,})', (req, res) => {
    let body = req.body;
    if (body) {
        let update_index = participants.map((participant) => {
            return parseInt(participant.id)
        }).indexOf(parseInt(req.params.id));

        if (update_index === -1) {
            res.json({message: 'Error'})
        }
        else {
            participants.splice(update_index,1);
            res.json({message: 'success'})
        }
    }
});

router.post('/', (req, res) => {
    let body = req.body;
    if (body.action === 'save_json')
        fs.writeFile('./routes/participants_state.json', JSON.stringify(participants, null, 4), (err) => {
            if (err){
                console.log(err);
                return;
            }
            res.json({message: 'success'})
        });
});

module.exports = router;
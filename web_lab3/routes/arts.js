const express = require('express');
const router = express.Router();
let fs = require("fs");

let arts = require('./arts_state');

router.get('/:id([0-9]{1,})', (req, res)=>{
    let art = arts.filter((art)=>{
        if(art.id === Number(req.params.id)) {
            res.render('arts/art_info', {art: art});
        }
    });
    res.status(404); // Ошибка – нет такой страницы
    res.end("404: Page not found")
});

router.get('/', (req, res)=> {
    let url = req['url'];
    url = (url.split('?'))[1];
    if (url === undefined){
        res.render('arts/list_of_arts', {arts: arts});
    }
    else{
        url = url.split('&')[0].split('=');
        if('clear' === url[0] && 'true' === 'true'){
            res.json({message: 'success', arts: arts});
        }
        else if('is_participate' === url[0]){
            let data = [];
            for (let art in arts) {
                if (arts[art].is_participate.toString() === url[1])
                    data.push(arts[art])
            }
            res.json({message: 'success', arts: data});
        }
        else{
            res.json({message: 'Error'})
        }
    }
});

router.put('/:id([0-9]{1,})', (req, res) => {
    let body = req.body;
    if (body){
        let update_index = arts.map((art) => {
            return parseInt(art.id)
        }).indexOf(parseInt(req.params.id));

        if (update_index === -1){
            res.json({message: 'Error'})
        }
        else if('participate' in body){
            arts[update_index].is_participate = body['participate'] === 'true';
            res.json({message: 'success', reload: true})
        }
        else if('name' in body){
            arts[update_index].name = body.name;
            arts[update_index].author = body.author;
            arts[update_index].description = body.description;
            arts[update_index].start_cost = body.start_cost;
            arts[update_index].min_cost_step = body.min_cost_step;
            res.json({message: 'success', reload: false})
        }
    }
});

router.post('/', (req, res) => {
    let body = req.body;
    console.log(arts);
    if (body.action === 'save_json')
        fs.writeFile('./routes/arts_state.json', JSON.stringify(arts, null, 4), (err) => {
            if (err){
                console.log(err);
                return;
            }
            res.json({message: 'success'})
        });
});

module.exports = router;
const express = require('express');
const router = express.Router();

let books = require(__dirname+'\\start_state.json');

router.get('/:id([0-9]{1,})', (req, res)=>{
    let book = books.filter((book)=>{
        if(book.id === Number(req.params.id)) {
            res.render('book_info', {info: book})
        }
    });
    res.status(404); // Ошибка – нет такой страницы
    res.end("404: Page not found")
});

router.get('/', (req, res)=>{
    let url = req['url'];
    url = (url.split('?'))[1];
    if (url === undefined){
        res.render('list_of_books', {books: books});
    }
    else{
        let data = {};
        url = url.split('&');
        for(let i in url)
        {
            let k_v = url[i].split('=');
            data[k_v[0]] = k_v[1];
        }
        let v = 'return_date' in data;
        if('in_library' in data) {
            if ('return_date' in data) {
                let ans = [];
                for (let book in books) {
                    if (!books[book]['in_library'])
                        ans.push(books[book])
                }
                ans.sort((a, b) => (a.return_date > b.return_date ? 1 : 0));
                //console.log(ans);
                res.json({message: 'success', books: ans});
            }
            else {
                let ans = [];
                for (let book in books) {
                    if (books[book]['in_library'])
                        ans.push(books[book])
                }
                res.json({message: 'success',books: ans});
            }
        }
        else if('clear' in data){
            res.json({message: 'success', books: books})
        }
        else{
            res.json({message: 'Error'})
        }
    }
});

router.get('/*', (req, res)=>{
    res.status(404); // Ошибка – нет такой страницы
    res.end("Page not found")
});

router.put('/:id([0-9]{1,})', (req, res) => {
    let body = req.body;
    if (body){
        let update_index = books.map((book) => {
            return parseInt(book.id)
        }).indexOf(parseInt(req.params.id));

        if (update_index === -1){
            res.json({message: 'Error', location: '/books'})
        }
        else if('clear' in body){
            books[update_index]['in_library'] = true;
            books[update_index]['issued_to'] = '';
            books[update_index]['return_date'] = '';
            res.json({message: 'success', location:'/books/'+req.params.id})
        }
        else if('issued_to' in body){
            books[update_index]['in_library'] = false;
            books[update_index]['issued_to'] = body['issued_to'];
            books[update_index]['return_date'] = body['return_date'];
            res.json({message: 'success', location:'/books/'+req.params.id})
        }
    }
});

router.put('/', (req, res) => {
    let body = req.body;
    let book = {};
    if (body['author'] && body['title'] && body['published']){
        book['id'] = books.length;
        book['author'] = body['author'];
        book['title'] = body['title'];
        book['published'] = body['published'];
        book['in_library'] = true;
        book['issued_to'] = "";
        book['return_date'] = "";
        books.push(book);
        res.json({message: 'success', book: book})
    }
    else{
        res.json({message: 'Error', location: '/books'})
    }
});

router.post('/', (req, res) => {
    let ans = req.body;
    //console.log(ans);
    let book = books.filter((book)=> {
        if (book.id === Number(ans['id'])) {
            //console.log('new book info', book.id);
            book.author = ans['author'];
            book.title = ans['title'];
            book.published = ans['published'];
            res.render('list_of_books', {books: books});
        }
    });
});

router.delete('/:id([0-9]{1,})', (req, res) => {
    let body = req.body;
    if (body) {
        let update_index = books.map((book) => {
            return parseInt(book.id)
        }).indexOf(parseInt(req.params.id));

        if (update_index === -1) {
            res.json({message: 'Error', location: '/books'})
        }
        else {
            books.splice(update_index,1);
            res.json({message: 'success', location:'/books/'+req.params.id})
        }
    }
});

module.exports = router;
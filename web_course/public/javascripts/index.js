document.addEventListener('DOMContentLoaded', function(){
    // let request = new XMLHttpRequest(); //TODO delete this??
    // request.onreadystatechange = function()
    // {
    //     if(request.readyState === 4 && request.status === 200)
    //     {
    //         localStorage.res = request.responseText;
    //     }
    // };
    // request.open("GET", `/records_info`, true);
    // request.send();

    if (localStorage.curr_user !== undefined && localStorage.curr_user !== '')
        document.getElementById('username_field').value = localStorage.curr_user;
});

let play = () =>{
    let username = document.getElementById('username_field').value.replace(/^\s+|\s+$/g, '');
    if (username === ''){
        alert('Введите Username');
    }
    else
    {
        localStorage.curr_user = username;
        window.location = 'game';
    }
};
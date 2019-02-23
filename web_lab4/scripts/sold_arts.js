$(document).ready(() => {
    let url = '';
    if(is_admin){
        url = '/sold';
        $('#buttons').append(`<div class="w3-col l3 m2 s2">
                                    <span> &#x00A0; </span>
                                </div>
                                <div class="w3-col l3 m4 s10">
                                <a href="/admin/${user_id}">
                                    <button class="w3-button w3-teal w3-margin">
                                        Страница админитстратора
                                    </button>
                                </a>
                            </div>
                            <div class="w3-col s2 m2 l1">
                                    <span> &#x00A0; </span>
                                </div>
                            <div class="w3-col s10 m4 l5">
                                <a href="/auction/${user_id}">
                                    <button class="w3-button w3-teal w3-margin">
                                        Аукцион
                                    </button>
                                </a>
                            </div>`)
    }
    else{
        url = `/sold/${user_id}`
        $('#buttons').append(`<div class="w3-col s12 w3-center">
                                <a href="/auction/${user_id}">
                                    <button class="w3-button w3-teal w3-margin">
                                        Аукцион
                                    </button>
                                </a>
                            </div>`)
    }
    $.ajax({
        type: "GET",
        url: url,
        success: (data) => {
            let sold = JSON.parse(data).sold.reverse();
            if(sold.length) {
                for(let pic of sold) {
                    let cur_sold_to = "Скрыто";
                    $.ajax({
                        type: "GET",
                        url: `/get_mem/${pic.sold_to}`,
                        success: (data) => {
                            $('#pictures').prepend(`<img src=/images/${pic.file}.jpg class="my_img" 
                            title="Название: ${pic.name}.Кому продана: 
                                ${JSON.parse(data).name}.За сколько: ${pic.sold_for}.">`)
                        }
                    });
                }
                $(document).tooltip({
                    track: true
                })
            }
            else
            {
                if(is_admin) {
                    $('#pictures').append('<h1>Ни одной картины не продано</h1>')
                }
                else{
                    $('#pictures').append('<h1>Ни одной картины не куплено</h1>')
                }
            }
        }
    });
});
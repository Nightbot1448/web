$(document).ready(() => {
    console.log(user_id);
    $('#auction_page').append(
        `<a href='/auction/${user_id}'> 
                    <button class="w3-button w3-teal w3-margin"> Аукцион </button>
                </a>`);
    $('#sold_arts_page').append(
        `<a href='/sold_arts_page/${user_id}'> 
                    <button class="w3-button w3-teal w3-margin"> Проданные картины </button>
                </a>`);
    $.ajax({
        type: "GET",
        url: '/bidders/',
        success: (data, textStatus, jqXHR) => {
            // console.log(data)
            var bidders = JSON.parse(data);
            // console.log(bidders);
            for (let i = 0; i < bidders.length; i++) {
                if (bidders[i] == 0)
                    continue;
                let is_admin = bidders[i].is_admin ? '\u2714' : '\u2716';
                $('#bidders').append(`<h3>${bidders[i].name}</h3>
                                        <div>
                                            <p>Имя: ${bidders[i].name}</p>
                                            <p>Средства: ${bidders[i].money/1000000000} млрд$</p>
                                            <p>Идентификатор: ${bidders[i].id}</p>
                                            <p>Администратор: ${is_admin}</p>
                                        </div>`);
            }
            makeBidCollaps();
        }
    })

    function makeBidCollaps() {
        $(() => {
            $('#bidders').accordion({
                collapsible: true
            })
        })

    }


    $.ajax({
        type: "GET",
        url: '/pict/',
        success: (data, textStatus, jqXHR) => {
            var pic = JSON.parse(data);
            // console.log(pic);
            for (let i = 0; i < pic.length; i++) {
                $('#pictures').append(`<img src=/images/${pic[i].file}.jpg width="300" height="300" class="my_img" 
                    title='Название: ${pic[i].name}. Минимальная цена: ${pic[i].start_cost/1000000} млн$.'>`);
                tipPic()
            }
        }
    });


    function tipPic() {
        $(() => {
            $(document).tooltip({
                track: true
            })
        })
    }
})
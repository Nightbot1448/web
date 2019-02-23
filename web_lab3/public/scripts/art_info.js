$(document).ready(function () {
    for (let key in art_object)
        $("#art_" + key.toString()).val(art_object[key.toString()])

    function call_modal(msg, duration=1000){
        let modal = $('#success_saved');
        $("#modal_body").text(msg);
        setTimeout(function () {
            modal.modal('hide')
        }, duration);
        modal.modal('show');
    }

    function put_art_info(data){
        $.ajax({
            method: "PUT",
            url: art_object.id,
            data: data,
            dataType: "json"
        })
            .done(function (data) {
                if (data.message === 'success') {
                    if (data.reload)
                        location.reload();
                    else{
                        call_modal('Успешно сохранено')
                    }
                }
            });
    }

    $('#exclude').click(() => {
        put_art_info({participate: false})
    });

    $('#expose').click(() => {
        put_art_info({participate: true})
    });

    $('#submit').click(() => {
        let obj = {
            name: $("#art_name").val(),
            author: $("#art_author").val(),
            description: $("#art_description").val(),
            start_cost: $("#art_start_cost").val(),
            min_cost_step: $("#art_min_cost_step").val(),
            max_cost_step: $("#art_max_cost_step").val()
        };
        let send = true;
        for(let key in obj){
            if(!obj[key].toString().replace(/^\s+|\s+$/g, '').length) {
                call_modal('Поле ' + $("#art_"+key).attr("name") + ' должно быть заполнено', 2000);
                send = false;
                break;
            }
            let is_num = parseInt(obj[key]);
            if (!isNaN(is_num) && is_num <= 0){
                call_modal('Значение поля ' + $("#art_"+key).attr("name") + ' должно быть положительным', 2000);
                send = false;
                break;
            }
        }
        if(send)
            put_art_info(obj);
    })
});
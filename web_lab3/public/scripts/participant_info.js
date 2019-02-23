$.validator.addMethod("positive_num", function(value, element) {
    return this.optional(element) || value > 0;
}, "Value must be positive");

$(document).ready(function () {
    $('#participant_name').val(participant_object.name);
    $('#participant_surname').val(participant_object.surname);
    $('#participant_cash').val(participant_object.cash/1000000);

    function check_valid(obj){
        for (let key in obj) {
            console.log(obj[key].toString().replace(/^\s+|\s+$/g, '').length);
            if (!obj[key].toString().replace(/^\s+|\s+$/g, '').length) {
                let str = 'Поле \"' + $("#participant_" + key).attr("name") + '\" должно быть заполнено';
                call_modal(str);
                return false;
            }
        }
        if(obj.cash <= 0)
        {
            call_modal('Значения поля \"Запас средств\" должно быть положительно');
            return false;
        }
        return true;
    }
    function call_modal(msg){
        let modal = $('#success_saved');
        $("#modal_body").text(msg);
        setTimeout(function () {
            modal.modal('hide')
        }, 1000);
        modal.modal('show');
    }

    $('#submit').click(() => {
        let obj = {
            name: $("#participant_name").val(),
            surname: $("#participant_surname").val(),
            cash: $("#participant_cash").val()*1000000,
        };
        if (check_valid(obj)){
            $.ajax({
                method: "PUT",
                url: participant_object.id,
                data: obj,
                dataType: "json"
            })
                .done(function (data) {
                    if (data.message === 'success') {
                        if (data.reload)
                            location.reload();
                        else {
                            call_modal("Успешно сохранено");
                        }
                    }
                });
        }
    });
    $("#exclude").click(() => {
        $.ajax({
            method: "DELETE"
        })
            .done(function (data) {
                if (data['message'] === 'success')
                    window.location = '/participants';
            });
    });
});

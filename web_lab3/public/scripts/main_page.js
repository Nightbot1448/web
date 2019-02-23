$(document).ready(function () {
    function success_save(){
        let modal = $('#success_saved');
        setTimeout(function () {
            modal.modal('hide')
        }, 1000);
        modal.modal('show');
    }
    $('#save_arts').click(() => {
        $.ajax({
            method: "POST",
            url: '/arts',
            data: {action: "save_json"},
            dataType: "json"
        })
            .done((data) => {
                if(data.message === 'success')
                    success_save();
            })
    });

    $('#save_participants').click(() => {
        $.ajax({
            method: "POST",
            url: '/participants',
            data: {action: "save_json"},
            dataType: "json"
        })
            .done((data) => {
                if(data.message === 'success')
                    success_save();
            })
    })
});
$(document).ready(function () {
    $("#book_author").val(book_json.author);
    $("#book_title").val(book_json.title);
    $('#book_published').val(book_json.published);
    $('#delete').click(function () {
        $.ajax({
            method: "DELETE"
        })
            .done(function (data) {
                if (data['message'] === 'success')
                    window.location = '/books';
            });
    });
    if(!book_json.in_library){
        let it = document.getElementById('book_issued_to');
        it.value = book_json.issued_to;
        it.disabled = true;
        let rd = document.getElementById('book_return_date');
        rd.value = book_json.return_date;
        rd.disabled = true;
    }
    $("#give_submit").click(function () {
        if (new Date($("#give_get_book_date").val()) < new Date())
            alert("Дата должна быть больше текущей");
        else{
            $.ajax({
                type: "PUT",
                url: book_json.id,
                data: {
                    issued_to: $("#give_get_book_name").val(),
                    return_date: $("#give_get_book_date").val()
                },
                dataType: "json"
            })
                .done(function (data) {
                    if (data['message'] === 'success')
                        location.reload();
                });
        }
    });
    $("#form").submit(function () {
        $('<input />').attr('type', 'hidden')
            .attr('name', "id")
            .attr('value', book_json.id)
            .appendTo('#form');
        return true;
    });
    $("#give_get_book").click(function () {
        if (!book_json.in_library) {
            const my_url = 'http://localhost:3000/books/' + book_json.id;
            $.ajax({
                type: "PUT",
                url: my_url,
                data: {
                    clear: 'issue_to'
                },
                dataType: "json"
            })
                .done(function (data) {
                    console.log(data);
                    location.reload();
                });
        }
    });
});
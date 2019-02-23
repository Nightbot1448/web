$(document).ready(() => {
    $('#submit').on('click', () => {
        let id = $('#user_id').val();
        $.ajax({
            type: "POST",
            url: `/current_user_id/${id}`,
            success: () => {
                $.ajax({
                    type: "GET",
                    url: `/get_mem/${id}`,
                    success: (data) => {
                        data = JSON.parse(data);
                        if (data.is_admin){
                            // console.log('admin');
                            let admin_link = `/admin/${id}`;
                            $('#admin_page').append(
                                $(`<a href=${admin_link}>`)
                                    .append($('<button>')
                                        .attr('class', 'w3-button w3-teal')
                                        .text('Страница администратора')
                                    )
                            );
                            $('#part_page').append($('<button>')
                                .attr('class', 'w3-button w3-teal')
                                .attr('id', 'auction_page')
                                .text('Страница участника')
                            );
                            $('#auction_page').on('click', () => {render_auction(id)});
                            let totals_link = `/sold_arts_page/${id}`;
                            $('#totals_page').append(
                                $(`<a href=${totals_link}>`)
                                    .append($('<button>')
                                        .attr('class', 'w3-button w3-teal')
                                        .text('Страница итогов')
                                    )
                            )
                        }
                        else{
                            render_auction(id);
                        }
                        $('#submit').attr('disabled', 'disabled');
                    }
                })
            }
        });
    });
    function render_auction(id) {
        window.location = `/auction/${id}`
    }
});
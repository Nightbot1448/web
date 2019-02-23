let curPrice;
let nick;
let limit;
let socket;
let min_step;
let active = false;


$(document).ready(() => {
    let widgetBTN = $('#widgetBtn');
    let requestBTN = $('#requestBtn');
    if (user_id !== 0){
        $.ajax({
            type: "GET",
            url: `/get_mem/${user_id}`,
            success: (data) => {
                if(JSON.parse(data).is_admin){
                    $('#sold_arts_page').append(`<a href='/sold_arts_page/${user_id}'>
                                            <button class="w3-button w3-teal"> Проданные картины </button></a>`);
                    $('#admin_page').append(`<a href='/admin/${user_id}'> <button class="w3-button w3-teal"> Станица администратора </button> </a>`)
                }
                else {
                    $('#sold_arts_page').append(`<a href='/sold_arts_page/${user_id}'>
                                            <button class="w3-button w3-teal"> Купленные картины </button></a>`);
                }
                widgetBTN.disabled = true;
                requestBTN.disabled = true;
                chat(JSON.parse(data).name);
                afterBtnClickSuccess(data);
                $('#widget').dialog({autoOpen: false});
                widgetBTN.click(function () {
                    $("#widget").dialog("open");
                    $('#value').text(min_step);
                });

                $('#addBtn').on('click', () => {
                    let rate = parseInt($("#value").text());
                    // console.log(curPrice, rate, user_money);
                    if (curPrice + rate < user_money){
                        $.ajax({
                            type: "PUT",
                            url: `/addPrice/${rate}/${user_id}`,
                            success: (data) => {
                                close_widget();
                            }
                        });
                    }
                    else
                        alert("Недостаточно средств");
                });

                requestBTN.on('click', () => {
                    $.ajax({
                        type: "GET",
                        url: '/loadcur',
                        success: (data) => {
                            data = JSON.parse(data).curPic;
                            if (data.sold_for < user_money)
                                widgetBTN.removeAttr('disabled');
                            else
                                alert("Недостаточно средств");
                        }
                    })
                });

                function afterBtnClickSuccess(data) {
                    var bid = JSON.parse(data);
                    nick = bid.name;
                    limit = bid.money;
                    $('#hello-tab').text(`Здравствуй, ${nick}. Баланс: ${limit/1000000} млн.$`);
                    loadCurImage()
                }


                function loadCurImage() {
                    $.ajax({
                        type: "GET",
                        url: "/loadcur/",
                        success: (data) => {
                            let cur = JSON.parse(data).curPic;
                            curPrice = cur.sold_for;
                            $('#curr_cost').html(`${cur.sold_for/1000000}`);
                            $("#currentPic").html('');
                            $("#currentPic").append(`<img src='/images/${cur.file}.jpg' id='curr_art'>`);
                            var handle = $("#value");
                            min_step = cur.minstep;
                            $('#slider').slider({
                                value: cur.minstep,
                                min: cur.minstep,
                                max: cur.maxstep,
                                step: (cur.maxstep - cur.minstep)/100,
                                create: function () {
                                    handle.text(cur.minstep);
                                },
                                slide: function (event, ui) {
                                    handle.text(ui.value);
                                }
                            });
                            post(`Текущий лот: ${cur.name} `, onlineInfo)
                        }
                    })
                }

                function chat(nick) {
                    socket = io.connect('http://localhost:3030');
                    socket.on('connect', () => {
                        socket.json.send({"type": "connect", "name": nick})
                        socket.on("message", (msg) => {
                            if (msg.type == "connect")
                            {
                                requestBtn.disabled = true;
                                widgetBtn.disabled = true;
                                addBtn.disabled = true;
                                post(msg.message, onlineInfo);
                            }
                        });
                        socket.on("time", (data) => {
                            $('#timer').text(data)
                        });
                        socket.on('hello', (data) => {
                            post(data, onlineInfo)
                        });
                        socket.on('nextPic', () => {
                            sold_art();
                            loadCurImage()
                        });

                        socket.on('timeTillEnd', (data) => {
                            postTimeTillEnd(data, onlineInfo)
                        });

                        socket.on('timeTillNext', (data) => {
                            if (data && data.sold) {
                                requestBtn.removeAttribute('disabled');
                                addBtn.removeAttribute('disabled');
                            }
                            else{
                                requestBtn.disabled = true;
                                addBtn.disabled = true;
                            }
                            postTimeTillNext(data.next, onlineInfo)
                        });

                        socket.on('sold', (data) => {
                            postSold(data, onlineInfo);
                            requestBtn.disabled = true;
                        });

                        socket.on('updatePrice', (data) => {
                            updatePrice(data);
                            postUpdatePrice(data, onlineInfo);
                            requestBtn.disabled = true;
                        });

                        socket.on('pause', (data) => {
                            close_widget();
                            requestBtn.disabled = true;
                            widgetBtn.disabled = true;
                            addBtn.disabled = true;
                            postPause(data, onlineInfo);
                        });

                        socket.on('start', (data) => {
                            requestBtn.removeAttribute('disabled');
                            addBtn.removeAttribute('disabled');
                            postStart(data, onlineInfo)
                        });

                        socket.on('end', (data) => {
                            requestBtn.disabled = true;
                            widgetBtn.disabled = true;
                            addBtn.disabled = true;
                            post(data, onlineInfo);
                            clear_f();
                        });
                        socket.on('sub_money', (data) => {
                            if (user_id === data.id)
                                $('#hello-tab').text(`Здравствуй, ${nick}. Баланс: ${Math.round(data.money/100000)/10} млн.$`);
                        })
                    });
                }
                const updatePrice = (data) => {
                    $('#curr_cost').html(`${JSON.parse(data).curPrice/1000000}`);
                };
                const close_widget = () => {$('#widget').dialog("close")};
                const clear_f = () => { $("#currentPic").empty();close_widget()};

                const sold_art = () => {
                    $.ajax({
                        type: "PUT",
                        url: `/soldTo/${user_id}`
                    })
                };
            }
        });
    }
});
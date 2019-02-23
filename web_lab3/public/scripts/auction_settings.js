$.validator.addMethod("positive_num", function(value, element) {
    return this.optional(element) || value > 0;
}, "Value must be positive");

$(document).ready(function () {
    $("#auction_date").val(auction_settings.date);
    $("#auction_time").val(auction_settings.time);
    $("#timeout_sale").val(auction_settings.timeout);
    $("#auction_end_time").val(auction_settings.end_time);
    $("#info_study_pause").val(auction_settings.study_pause);
});
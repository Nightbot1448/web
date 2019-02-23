let post;
let postTimeTillEnd;
let postTimeTillNext;
let postSold;
let postUpdatePrice;
let postPause;
let postStart;
let id = 0;

$(document).ready(() => {

    $(() => {
        $('#onlineInfo').draggable();
    });

    post = function post(input,myTarget) {
        myTarget.contentWindow.postMessage({"type":"info","message": input},'*');
    };

    postTimeTillEnd = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"timeTillEnd","message": input},'*');
    };
    postTimeTillNext = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"timeTillNext","message": input},'*');
    };

    postSold = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"sold","message": input},'*');
    };

    postUpdatePrice = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"update","message": input},'*');
    };

    postPause = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"pause","message": input},'*');
    };

    postStart = function post(input, myTarget) {
        myTarget.contentWindow.postMessage({"type":"start","message": input},'*');
    }

});

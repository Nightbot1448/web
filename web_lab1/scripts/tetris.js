const bl_w = 10;
const bl_h = 20;
const step=30;
let scores = 0;
let level = 1;
let game_speed = 800;
const center_square = step/2;
let can_move = true;
let current_figure;
let next_figure;
let interval;
let matrix = [];
figures = [FigureI, FigureJ, FigureO,  FigureL, FigureZ, FigureS, FigureS, FigureT];


function refillMatrix(){
    for (let i=0; i<bl_h+2; i++){
        matrix[i] = [];
        for(let j=0; j<bl_w+2; j++){
            matrix[i][j] = ( j === 0 || i === bl_h+1 || j === bl_w+1) ? 1 : 0;
        }
    }
}

function checkClearLines() {
    let for_delete = [];
    for(let i=bl_h; i > 1; i--){
        let counter = 0;
        for( let j=1; j<11; j++)
            if (matrix[i][j])
                counter++;
        if (counter === bl_w)
            for_delete.push(i);
    }
    if(for_delete.length) {
        clearLines(for_delete);
        recountMatrix(for_delete);
        updateScoresSpeed(for_delete.length);
    }
}


function updateScoresSpeed(quantity_lines){
    for(let i=1; i <= quantity_lines; i++)
    {
        if(scores / 100 + 1 >= level && scores >= 100)
        {
            level++;
            level_context.clearRect(0, 0, level_canvas.width, level_canvas.height);
            level_context.fillText('Level:' + level, 0, 4*level_canvas.height/5);
            game_speed = Math.floor(game_speed*0.9);
            clearInterval(interval);
            interval = setInterval (mainAction, game_speed);
        }
        scores += Math.floor(10 * i * level);
    }
    score_context.clearRect(0,0, score_canvas.width, score_canvas.height);
    score_context.fillText(scores, score_canvas.width/10, 2*score_canvas.height/3);

}

function recountMatrix(lines_to_delete) {
    for(let line of lines_to_delete)
        for (let j = line; j > 1; j--)
            matrix[j] = matrix[j - 1].slice();
    for( let i=0; i<lines_to_delete.length; i++)
        for (let j = 0; j < bl_w + 2; j++)
            matrix[i][j] = (j === 0 || j === bl_w + 1) ? 1 : 0;
}

function clearLines(lines_to_delete) {
    for(let line of lines_to_delete.reverse()){
        let data = main_context.getImageData(0, 0, main_canvas.width, (line-1)*step);
        main_context.clearRect(0, 0, main_canvas.width, line*step);
        main_context.putImageData(data, 0, step);
    }
}

function canSpawn(){
    for(let sq of next_figure.squares)
        if (matrix[Math.floor(sq.coordinates[1]/step) + 1][Math.floor(sq.coordinates[0]/step) + 1])
            return false;
    return true;
}

function mainAction() { //Контроль падения фигурки, создание новой и очистка линии
    if (current_figure.canMove())
        current_figure.moveDown();
    else {
        checkClearLines();
        if (!canSpawn()) {
            exit();
        }
        else {
            current_figure = next_figure;
            current_figure.fillField();
            next_figure = new figures[Math.floor(Math.random()*figures.length)]();
            next_figure_context.clearRect(0, 0,next_figure_canvas.width, next_figure_canvas.height);
            let offset = offsetNextFigure();
            next_figure.fillField(next_figure_context, offset[0], offset[1]);
            can_move = true;
        }
    }
}

function newGame(){
    can_move = true;
    level_context.fillStyle = '#ea9100';
    level_context.font = "200% Arial";
    level_context.fillText("Level: "+ level, 0, 4*level_canvas.height/5);
    console.log("Level: " + level);
    clearInterval (interval);
    refillMatrix();
    score_context.fillStyle = 'white';
    score_context.font = "200% Arial";
    score_context.fillText(scores, score_canvas.width/10, 2*score_canvas.height/3);
    current_figure = new figures[Math.floor(Math.random()*figures.length)](main_context);
    current_figure.fillField();
    next_figure = new figures[Math.floor(Math.random()*figures.length)](next_figure_context);
    let offset = offsetNextFigure();
    next_figure.fillField(next_figure_context, offset[0], offset[1]);
    interval = setInterval (mainAction, game_speed); //скорость игры, мс
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if(can_move)
        switch (keyName) {
            case 'ArrowLeft':
                if (current_figure.canMove(-1, false))
                    current_figure.moveLeft();
                break;
            case 'ArrowRight':
                if (current_figure.canMove(1, false))
                    current_figure.moveRight();
                break;
            case 'ArrowUp':
                if(current_figure.canRotate())
                    current_figure.rotate();
                break;
            case 'ArrowDown':
                if (current_figure.canMove(0, true))
                    current_figure.moveDown();
                break;
            case ' ':
                can_move = false;
                while(current_figure.canMove(0, true))
                    current_figure.moveDown();
                break;
            default:
        }
});

function exit() {
    can_move = false;
    clearInterval (interval);
    main_context.clearRect(0, 0, main_canvas.width, main_canvas.height);
    next_figure_context.clearRect(0, 0, next_figure_canvas.width, next_figure_canvas.height);
    main_context.font = "400% Arial";
    main_context.fillText('Game over', main_canvas.width/30, 1*main_canvas.height/3);
    main_context.font = "200% Arial";
    main_context.fillText('Your score: '+ scores, main_canvas.width/4, main_canvas.height/2);
    main_context.fillText('Your level: ' + level, main_canvas.width/4, 3*main_canvas.height/5);
    document.getElementById('startButton').disabled = false;
    document.getElementById('mainButton').disabled = false;

    updateScoreTable();
}


function offsetNextFigure() {
    let figure_name = next_figure.constructor.name;
    switch (figure_name) {
        case 'FigureI':
            return [2.5, 1.5];
        case 'FigureO':
            return [2.5, 1];
        default://j,l t,z s
            return [3, 1];
    }
}


function updateScoreTable() {
    if (localStorage['current_score'] < scores)
        localStorage['current_score'] = scores;
    let records = localStorage['scores'];
    if (records !== undefined && records.length){
        records = JSON.parse(records);
        if (records[localStorage['current_user']]){
            if (records[localStorage['current_user']] < scores )
                records[localStorage['current_user']] = scores;
        }
        else{
            records[localStorage['current_user']] = scores;
        }
    }
    else
    {
        records = {};
        records[localStorage['current_user']] = scores;
    }
    console.log(records);
    localStorage['scores'] = JSON.stringify(records);
}

function restart() {
    document.getElementById('mainButton').disabled = true;
    document.getElementById('startButton').disabled = true;
    main_context.clearRect(0, 0, main_canvas.width, main_canvas.height);
    next_figure_context.clearRect(0, 0, next_figure_context.width, next_figure_context.height);
    score_context.clearRect(0, 0, score_canvas.width, score_canvas.height);
    level_context.clearRect(0, 0, level_canvas.width, level_canvas.height);
    refillMatrix();
    newGame();
}

function toMain(){
    window.location = 'index.html';
}
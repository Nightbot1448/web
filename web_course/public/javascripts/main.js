
function startGame()
{
    let canvas = document.getElementById("gameCanvas");
    let scoreElem = document.getElementById("score");
    gameManager = new GameManager(
        canvas,
        ['/levels/level1.json', '/levels/level2.json'], //
        '/sprites/sprites.json',   // entity sprites description path
        '/images/spritesheet.png',
        scoreElem);// entity sprites packed image path //infoWindow, infoBlock
}

startGame();

class EventsManager
{
    bind = [];
    action = [];
    gameManager = null;

    constructor(canvas, gameManager)
    {
        this.gameManager = gameManager;
        this.bind[87]='up';
        this.bind[65]='left';
        this.bind[68]='right';
        // this.bind[13]='restart';

        let self = this;

        document.body.addEventListener("keydown", function(event)
        {
            self.onKeyDown(event, self)
        });
        document.body.addEventListener("keyup", function(event)
        {
            self.onKeyUp(event, self)
        });
    }

    onKeyDown(event, self)
    {
        let willDo = self.bind[event.keyCode];
        if(willDo)
        {
            self.action[willDo] = true;
        }
    }

    onKeyUp(event, self)
    {
        let willDo = self.bind[event.keyCode];
        if(willDo)
        {
            self.action[willDo] = false;
        }
    }

}
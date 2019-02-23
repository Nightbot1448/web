class GameManager
{
    entities = [];
    player = null;
    laterKill = [];

    playing_time = 0;
    playing_time_interval;

    spriteManager = null;
    eventsManager = null;
    physicManager = null;
    soundsManager = null;
    mapManager = null;
    canvas = null;
    ctx = null;

    currentLevel = 0;
    levels = [];
    playInterval = null;
    timeElem = undefined;


    constructor(canvas, levelPaths, spritePath, spritesheetPath, timeElem, infoElem, infoWindow, hideThisAfterLoad)
    {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.timeElem = timeElem;

        for(let i = 0; i<levelPaths.length; i++)
        {
            this.levels.push(levelPaths[i]);
        }

        this.soundsManager = new SoundsManager(this);
        this.mapManager = new MapManager(this.levels[this.currentLevel], this);
        this.spriteManager = new SpriteManager(spritePath, spritesheetPath, this);
        this.mapManager.parseEntities();
        this.eventsManager = new EventsManager(canvas, this);
        this.physicManager = new PhysicManager(this, 50);

        this.play();

    }

    initPlayer(obj)
    {
        this.player = obj;
    }

    entityFactory(type, name, x, y)
    {
        let resultEntity = null;
        switch(type)
        {
            case "Player":
                resultEntity = new Player(100, type, name, x, y, this);
                break;
            case "Enemy":
                resultEntity = new Tank(100, type, name, x, y, this);
                break;
            default:
                resultEntity = null;
        }
        return resultEntity;
    }

    kill(obj, isNextLevel)
    {
        this.laterKill.push(obj);
        if(obj.type === "Player" && this.playInterval !== null)
        {

            clearInterval(this.playInterval);
            this.playInterval = null;
            if(isNextLevel === undefined)
            {
                clearInterval(this.playing_time_interval);
                this.soundsManager.playSound('death');
                setTimeout(() => {location.reload()}, 400);
            }
        }
    }

    update()
    {
        if(this.player === null)
        {
            console.log("player wasn't loaded");
            return;
        }

        this.player.move_x = 0;
        this.player.move_y = 0;

        if(this.eventsManager.action["up"])
        {
            if (this.player.impulse === 0)
            {
                this.soundsManager.playSound('jump');
                this.player.impulse = -10;
            }
        }

        if(this.eventsManager.action["left"])
            this.player.move_x = -1;

        if(this.eventsManager.action["right"])
            this.player.move_x = 1;
        this.entities.forEach(function(event)
        {
            try {
                event.update();
                if(event.type === 'Enemy')
                {
                    event.move_y = 0;
                }
            } catch(ex) {
            }
        });
        this.mapManager.draw(this.ctx);
        this.draw(this.ctx);

    }

    draw()
    {
        let self = this;
        for(let entityNum = 0; entityNum < this.entities.length; entityNum++)
        {
            self.entities[entityNum].draw();
        }
    }

    play()
    {
        let self = this;
        let tryStart = setInterval(
            function()
            {
                console.log('try start');
                if(self.mapManager.jsonLoaded &&
                    self.mapManager.imgLoaded &&
                    self.spriteManager.jsonLoaded &&
                    self.spriteManager.imgLoaded)
                {
                    if(self.currentLevel === 0)
                        self.playing_time_interval = setInterval(
                            () => {
                                self.timeElem.innerHTML = self.playing_time;
                                self.playing_time++;
                            }, 1000);
                    self.playInterval = setInterval(function()
                    {
                        self.update();
                    },10);
                    clearInterval(tryStart);
                }
            }, 100);
    }

    goToNextLevel()
    {
        this.entities = [];
        this.player = null;
        this.currentLevel++;
        if(this.currentLevel === this.levels.length)
        {
            let name = localStorage['curr_user'];
            this.saveResult(name, this.playing_time);
            this.currentLevel = -1;
            window.location.href=window.location.href+'records/';
            return;
        }
        this.mapManager = new MapManager(this.levels[this.currentLevel], this);
        this.mapManager.parseEntities();
        this.play();
    }

    saveResult(name,record)
    {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function()
        {
            if(request.readyState === 4 && request.status === 200)
            {
                console.log('record added');
            }
        };
        request.open("PUT", `/?name=${name}&record=${record}`, true);
        request.send();
    }
}
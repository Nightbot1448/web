class Entity
{
    name = '';
    type = '';
    pos_x = 0;
    pos_y = 0;
    gameManager = null;

    constructor(type, name, pos_x, pos_y, gameManager)
    {
        this.gameManager = gameManager;
        this.type = type;
        this.name = name;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}

class Player extends Entity
{
    impulse = 0;
    lifetime = 0;
    move_x = 0;
    move_y = 0;
    size_x = 0;
    size_y = 0;
    speed = 2;
    currentSpriteType = null;

    constructor(lifetime, type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
        let sprite = this.gameManager.spriteManager.getSprite(this.type);
        this.currentSpriteType = this.type;
        this.size_x = sprite.w;
        this.size_y = sprite.h;
        this.lifetime = lifetime;
    }

    draw()
    {
        // draw object
        if(this.move_x > 0)
        {
            this.currentSpriteType = this.type+'_Left';
        }
        if(this.move_x < 0)
        {
            this.currentSpriteType = this.type;
        }
        this.gameManager.spriteManager.drawSprite(this.currentSpriteType, this.pos_x, this.pos_y);
    }

    update()
    {
        // update in cycle
        this.gameManager.physicManager.update(this)
    }

    onTouchEntity(obj)
    {
        if(obj.type === "Enemy")
        {
            this.kill();
        }
    }

    onTouchMap(tileset)
    {
        const EXIT_TILE_0 = 74;
        const EXIT_TILE_1 = 75;
        const EXIT_TILE_2 = 76;
        const EXIT_TILE_3 = 77;
        if(tileset === EXIT_TILE_0 || tileset === EXIT_TILE_1 || tileset === EXIT_TILE_2 || tileset === EXIT_TILE_3)
        {
            this.kill(true);
            this.gameManager.goToNextLevel();
        }

    }

    kill(goNextLevel)
    {
        // destroy this
        if(goNextLevel !== undefined)
        {
            this.gameManager.kill(this, goNextLevel);
            this.gameManager.soundsManager.playSound("next level");
        }
        else
        {
            this.gameManager.kill(this);
        }
    }
}

class Tank extends Entity
{
    impulse = 0;

    lifetime = 0;
    move_x = 1;
    move_y = 0;
    speed = 1;

    constructor(lifetime, type, name, pos_x, pos_y, gameManager)
    {
        super(type, name, pos_x, pos_y, gameManager);
        let sprite = this.gameManager.spriteManager.getSprite(this.type);
        this.size_x = sprite.w;
        this.size_y = sprite.h;
        this.lifetime = lifetime;
        this.currentSpriteType = this.type;

    }

    draw()
    {
        // draw object

        this.gameManager.spriteManager.drawSprite(this.currentSpriteType,
            this.pos_x, this.pos_y);
    }

    onTouchMap()
    {
        this.move_x = this.move_x * -1;
    }

    rotate()
    {
        if(this.currentSpriteType === this.type)
        {
            this.currentSpriteType = this.type+'_Right';
        }
        else
        {
            this.currentSpriteType = this.type;
        }
    }

    update()
    {
        this.gameManager.physicManager.update(this)
    }

    onTouchEntity(obj)
    {
        // collide entities handle
        if(obj.type === "Player")
        {
            obj.kill();
        }
        else
        {
            this.move_x = this.move_x * -1;
        }
    }
}
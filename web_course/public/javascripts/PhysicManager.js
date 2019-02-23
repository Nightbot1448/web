class PhysicManager
{
    gameManager = null;
    EMPTY_SPACE = null;

    constructor(gameManager, empty_space_tile)
    {
        this.gameManager = gameManager;
        this.EMPTY_SPACE = empty_space_tile;
    }

    update(obj)
    {
        let isInAirLeft = this.gameManager.mapManager.getTilesetIdx(obj.pos_x, obj.pos_y+obj.size_y+Math.abs(obj.impulse));
        let isInAirRight = this.gameManager.mapManager.getTilesetIdx(obj.pos_x+obj.size_x, obj.pos_y+obj.size_y+Math.abs(obj.impulse));
        // let entityUnder = this.entityAtXY(obj, obj.pos_x, obj.pos_y);

        if((isInAirLeft === this.EMPTY_SPACE) && (isInAirRight === this.EMPTY_SPACE) )
        {
            if(obj.type === 'Player' /*&& !entityUnder*/)
            {
                obj.impulse += 0.3;
            }

        }
        else
        {
            if(isInAirLeft === isInAirRight && obj.onTouchMap !== undefined)
            {
                obj.onTouchMap(isInAirLeft);
            }
            else
            {
                if(obj.type === 'Enemy')
                {
                    obj.rotate();
                }
            }
            if (obj.impulse !== undefined && obj.impulse > 0)
            {
                obj.impulse = 0;
            }

        }

        let multiplierY = obj.speed;

        if(obj.impulse !== undefined)
        {

            if(obj.impulse > 10)
                obj.impulse = 10;

            if(obj.impulse > 0) // move down
            {
                multiplierY = obj.impulse;
                obj.move_y = 1;
            }

            if(obj.impulse < 0) // move up
            {
                multiplierY = -obj.impulse;
                obj.move_y = -1;
                obj.impulse += 0.3;
            }
        }

        if (obj.move_x === 0 && obj.move_y === 0)
        {
            return;
        }

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * multiplierY);

        let entity = this.entityAtXY(obj, newX, newY);

        let tileset = this.checkMove(obj, newX, newY);

        let destTileset = tileset;

        if (tileset !== this.EMPTY_SPACE)
        {
            tileset = this.checkMove(obj, obj.pos_x, newY);
            if (tileset !== this.EMPTY_SPACE)
            {
                tileset = this.checkMove(obj, newX, obj.pos_y);

                if (tileset === this.EMPTY_SPACE)
                {
                    newY = obj.pos_y;
                }
            }
            else
            {
                if(obj.type === 'Enemy')
                {
                    obj.rotate();
                }
                newX = obj.pos_x;
            }

        }
        if(entity !== null && obj.onTouchEntity)
        {
            obj.onTouchEntity(entity);
        }

        if(destTileset !== this.EMPTY_SPACE && obj.onTouchMap)
        {
            obj.onTouchMap(destTileset);
        }

        if(tileset === this.EMPTY_SPACE && entity === null)
        {
            obj.pos_x = newX;
            obj.pos_y = newY;
        }
    }

    checkMove(obj, x, y)
    {
        let tileset = this.gameManager.mapManager.getTilesetIdx(x, y);

        if(tileset === this.EMPTY_SPACE)
        {
            tileset = this.gameManager.mapManager.getTilesetIdx(x + obj.size_x, y + obj.size_y);
        }

        if(tileset === this.EMPTY_SPACE)
        {
            tileset = this.gameManager.mapManager.getTilesetIdx(x, y + obj.size_y);
        }

        if(tileset === this.EMPTY_SPACE)
        {
            tileset = this.gameManager.mapManager.getTilesetIdx(x + obj.size_x, y);
        }

        return tileset;

    }

    entityAtXY(obj, x, y)
    {
        for(let i = 0; i<this.gameManager.entities.length; i++)
        {
            let entity = this.gameManager.entities[i];

            if(entity.name !== obj.name)
            {
                if((x + obj.size_x < entity.pos_x)    ||
                    (y + obj.size_y < entity.pos_y)    ||
                    (x > entity.pos_x + entity.size_x) ||
                    (y > entity.pos_y + entity.size_y))
                    continue;
                return entity;
            }
        }
        return null;
    }
}
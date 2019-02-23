class Square {
    constructor(x, y, color) {
        this.coordinates = [x + center_square, y + center_square];
        this.color = color;
    }
    clear() {
        main_context.clearRect(this.coordinates[0] - center_square, this.coordinates[1] - center_square, step, step);
    }
    draw(context, offset_x = 0, offset_y = 0){
        context.fillStyle = this.color;
        context.fillRect(this.coordinates[0]-center_square+1-offset_x*step,
            this.coordinates[1]-center_square+1+offset_y*step, step-2, step-2);
        context.strokeStyle = "white";
        context.strokeRect(this.coordinates[0]-center_square+1-offset_x*step,
            this.coordinates[1]-center_square+1+offset_y*step, step-2,step-2);
    }
    moveDown() {
        this.coordinates[1] += step;
    }
    moveLeft() {
        this.coordinates[0] -= step;
    }
    moveRight() {
        this.coordinates[0] += step;
    }
    canRotate(center){
        let tmp_y = this.coordinates[1] - center.y;
        let tmp_x = this.coordinates[0] - center.x;
        let new_x = center.x - tmp_y;
        let new_y = center.y + tmp_x;
        return [new_x, new_y];
    }
    rotate(center) {
        let tmp_y = this.coordinates[1] - center.y;
        let tmp_x = this.coordinates[0] - center.x;
        this.coordinates[0] = center.x - tmp_y;
        this.coordinates[1] = center.y + tmp_x;
        // if ( 0 < this.coordinates[0] && this.coordinates[0] < canvas.width && this.coordinates[1] > 0) {
        //     return 'ok';
        // }
        // else if (this.coordinates[0] < 0) {
        //     return 'right';
        // }
        // else if (this.coordinates[0] > canvas.width){
        //     return 'left';
        // }
        // else if (this.coordinates[1]){
        //     return 'down';
        // }
    }
}

class Figure{
    constructor(){
        this.color = '#ffffff';
        this.center = null;
        this.squares = [];
    }

    canMove(move_tow = 0, move_down = true){
        let coordinates = [];
        for(let sq of this.squares)
            coordinates.push(sq.coordinates);
        for(let sq of this.squares){
            let log = true;
            for(let val of coordinates){
                if (val[0] === sq.coordinates[0]+step*move_tow && val[1] === sq.coordinates[1]+step*move_down) {
                    log = false;
                    break;
                }
            }
            if (log && matrix[Math.floor((sq.coordinates[1]+center_square*move_down)/step)+1]
                [Math.floor((sq.coordinates[0]+step*move_tow)/step)+1] === 1)
                return false;
        }
        return true;
    }

    canRotate() {
        let coordinates = [];
        for(let sq of this.squares)
            coordinates.push(sq.coordinates);
        for (let sq of this.squares) {
            let imposition = false;
            let new_coordinates = sq.canRotate(this.center);
            if (new_coordinates[0] < 0 || new_coordinates[1] < 0 || new_coordinates[1] > main_canvas.height)
                return false;
            for( let val of coordinates) {
                // console.log('\t', val);
                if (new_coordinates[0] === val[0] && new_coordinates[1] === val[1] ) {
                    imposition = true;
                    break;
                }
            }
            if (!imposition &&
                matrix[(new_coordinates[1]-center_square)/step+1][(new_coordinates[0]-center_square)/step+1] === 1)
                return false;
        }
        return true;
    }

    moveDown(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveDown();
        if(need_draw) {
            this.draw(main_context);
            this.matrixFill();
        }
        this.center.y += step;
    };
    moveLeft(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveLeft();
        this.center.x -= step;
        if(need_draw) {
            this.draw(main_context);
            this.matrixFill();
        }
    };
    moveRight(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveRight();
        if(need_draw) {
            this.matrixFill();
            this.draw(main_context);
        }
        this.center.x += step;
    };
    rotate() {
        this.matrixClear();
        this.clear();
        for(let sq of this.squares)
        {
            let res = sq.rotate(this.center);
            switch(res){
                case 'left':
                    this.moveLeft(false);
                    break;
                case 'right':
                    this.moveRight(false);
                    break;
                case 'down':
                    this.moveDown(false);
                    break;
            }
        }
        this.draw(main_context);
        this.matrixFill();
    }
    draw(context = main_context) {
        for(let sq of this.squares)
            sq.draw(context);
    }
    clear() {
        for(let sq of this.squares)
            sq.clear();
    }
    matrixClear() {
        for(let sq of this.squares)
            matrix[Math.floor(sq.coordinates[1]/step) + 1][Math.floor(sq.coordinates[0]/step) + 1] = 0
    }
    matrixFill(){
        for(let sq of this.squares)
            matrix[Math.floor(sq.coordinates[1]/step) + 1][Math.floor(sq.coordinates[0]/step) + 1] = 1;
    }

    fillField(context = main_context, offset_x = 0, offset_y = 0){
        if (context === main_context)
            this.matrixFill();
        for(let sq of this.squares)
            sq.draw(context, offset_x, offset_y);
    }
}

class FigureL extends Figure{
    constructor(){
        super();
        this.color = '#00FFFF';
        this.center = {x: step*5.5, y: step*0.5};
        this.addSquares();
    }

    addSquares(){
        this.squares.push(new Square(step*4, step, this.color));
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*6, 0, this.color));
    }
}
class FigureJ extends Figure{
    constructor(){
        super();
        this.color = '#4b50ff';
        this.center = {x: step*5.5, y: step*0.5};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*6, step, this.color));
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*6, 0, this.color));
    }
}
class FigureO extends Figure{
    constructor(){
        super();
        this.color = '#ffa100';
        this.center = {x: step*5, y: step};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*4, step, this.color));
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, step, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
    }
}
class FigureZ extends Figure{
    constructor(){
        super();
        this.color = '#78ff4c';
        this.center = {x: step*5.5, y: step*1.5};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*5, step, this.color));
        this.squares.push(new Square(step*6, step, this.color));
    }
}
class FigureS extends Figure{
    constructor(){
        super();
        this.color = '#ff4253';
        this.center = {x: step*5.5, y: step*1.5};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*4, step, this.color));
        this.squares.push(new Square(step*5, step, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*6, 0, this.color));
    }
}
class FigureT extends Figure{
    constructor(){
        super();
        this.color = '#c577ff';
        this.center = {x: step*5.5, y: step*0.5};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*6, 0, this.color));
        this.squares.push(new Square(step*5, step, this.color));
    }
}
class FigureI extends Figure{
    constructor(){
        super();
        this.color = '#ffff3e';
        this.center = {x: step*5, y: step};
        this.addSquares();
    }
    addSquares(){
        this.squares.push(new Square(step*3, 0, this.color));
        this.squares.push(new Square(step*4, 0, this.color));
        this.squares.push(new Square(step*5, 0, this.color));
        this.squares.push(new Square(step*6, 0, this.color));
    }
}
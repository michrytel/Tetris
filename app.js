    const grid = document.querySelector(".game__grid");
    const squares = Array.from(document.querySelectorAll(".game__grid div"));
    const score = document.querySelector("#score");
    const startBtn = document.querySelector(".play__btn");
    const width = 10;

    //blocks, rotation
    const firstShape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const secondShape = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]
    const thirdShape = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    const fourthShape = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const fifthShape = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    const shapes = [firstShape, secondShape, thirdShape, fourthShape, fifthShape];
    let position = 4;
    let rotation = 0;

    //randomize current shape
    let random = Math.floor(Math.random()*shapes.length);
    let current = shapes[random][rotation];

    //draw shape
    const draw = () => {
        current.forEach(index => {
            squares[position + index].classList.add('tetromino');
        })
    }
    draw()

    //undraw shape
    const undraw = () => {
        current.forEach(index => {
            squares[position + index].classList.remove('tetromino');
        })
    }
    //moving tetrominos by keyboard (keyCodes)
    function control(e) {
        if(e.keyCode === 37) moveLeft();
        else if (e.keyCode === 38) rotate();
        else if (e.keyCode === 39) moveRight();
        else if (e.keyCode === 40) moveDown();
    }
    document.addEventListener('keyup', control);

    //move down
    const moveDown = () => {
        undraw();
        position += width;
        draw();
        freeze();
    }
    timerID = setInterval(moveDown, 1000)

    //stop at the end
    const freeze = () => {
        if(current.some(index => squares[position + index + width].classList.contains(`end`))) {
            current.forEach(index => squares[position + index].classList.add(`end`));
            random = Math.floor(Math.random() * shapes.length);
            current = shapes[random][rotation];
            position = 4;
            draw()
        }
    }

    //move left and right
    const moveLeft = () => {
        undraw();
        const leftEdge = current.some(index => (position + index) % width === 0);
        if(!leftEdge) position -=1;
        if(current.some(index => squares[position + index].classList.contains('end'))) {
            position +=1
        }
        draw();
    }
    const moveRight = () => {
        undraw();
        const rightEdge = current.some(index => (position + index) % width === width -1);
        if(!rightEdge) position +=1;
        if(current.some(index => squares[position + index].classList.contains('end'))) {
            position -=1
        }
        draw();
    }

    //rotate
    const rotate = () => {
        undraw();
        rotation++;
        if(rotation === current.length) rotation = 0;
        current = shapes[random][rotation]
        checkRotatedPosition()
        draw()
    }

    ///rotate at the edge
    const rightEdge = () => current.some(index=> (position + index + 1) % width === 0)
    const leftEdge = () => current.some(index=> (position + index) % width === 0)
    const checkRotatedPosition = () => {
        let pos =  position
        if ((pos+1) % width < 4) {
            if (rightEdge()){
                position += 1
                checkRotatedPosition()
            }
        }
        else if (pos % width > 5) {
            if (leftEdge()){
                position -= 1
                checkRotatedPosition()
            }
        }
    }



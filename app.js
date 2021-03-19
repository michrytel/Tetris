const grid = document.querySelector(".game__grid");
let squares = Array.from(document.querySelectorAll(".game__grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector(".play__btn");
const width = 10;
let nextRandom = 0;
let score = 0;
let timerID
const colors = [
    `#551177`,
    `#238100`,
    `#ee0000`,
    `#ff0077`,
    `#4db7f5`
]

//blocks, rotation
const firstShape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]
const secondShape = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
]
const thirdShape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]
const fourthShape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]
const fifthShape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]
const shapes = [firstShape, secondShape, thirdShape, fourthShape, fifthShape];
let position = 4;
let rotation = 0;

//randomize current shape
let random = Math.floor(Math.random() * shapes.length);
let current = shapes[random][rotation];

//draw shape
const draw = () => {
    current.forEach(index => {
        squares[position + index].classList.add('tetromino');
        squares[position + index].style.backgroundColor = colors[random];
    })
}

//undraw shape
const undraw = () => {
    current.forEach(index => {
        squares[position + index].classList.remove('tetromino');
        squares[position + index].style.backgroundColor = ``;

    })
}

//moving tetrominos by keyboard (keyCodes)
function control(e) {
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
}

document.addEventListener('keyup', control);

//show next
const nextDisplay = document.querySelectorAll(".show__next div");
const nextWidth = 4;
let nextIndex = 0;

const nextShapes = [
    [1, nextWidth+1, nextWidth*2+1, 2], //firstShape
    [0, nextWidth, nextWidth+1, nextWidth*2+1], //secondShape
    [1, nextWidth, nextWidth+1, nextWidth+2], //thirdShape
    [0, 1, nextWidth, nextWidth+1], //fourthShape
    [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1] //fifthShape
]

const displayNextShape = () => {
    nextDisplay.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = ``;
    })
    nextShapes[nextRandom].forEach(index => {
        nextDisplay[nextIndex + index].classList.add('tetromino');
        nextDisplay[nextIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//play button
startBtn.addEventListener(`click`, () => {
    if(timerID) {
        clearInterval(timerID)
        timerID = null
    } else {
        draw()
        timerID = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * shapes.length)
        displayNextShape()
    }

})
//move down
const moveDown = () => {
    undraw();
    position += width;
    draw();
    freeze();
}

//stop at the end
const freeze = () => {
    if (current.some(index => squares[position + index + width].classList.contains(`end`))) {
        current.forEach(index => squares[position + index].classList.add(`end`));
        random = nextRandom
        nextRandom = Math.floor(Math.random() * shapes.length);
        current = shapes[random][rotation];
        position = 4;
        draw()
        displayNextShape()
        addScore()
        gameOver()
    }
}

//move left and right
const moveLeft = () => {
    undraw();
    const leftEdge = current.some(index => (position + index) % width === 0);
    if (!leftEdge) position -= 1;
    if (current.some(index => squares[position + index].classList.contains('end'))) {
        position += 1
    }
    draw();
}
const moveRight = () => {
    undraw();
    const rightEdge = current.some(index => (position + index) % width === width - 1);
    if (!rightEdge) position += 1;
    if (current.some(index => squares[position + index].classList.contains('end'))) {
        position -= 1
    }
    draw();
}

//rotate
const rotate = () => {
    undraw();
    rotation++;
    if (rotation === current.length) rotation = 0;
    current = shapes[random][rotation]
    checkRotatedPosition()
    draw()
}

//rotate at the edge
const rightEdge = () => current.some(index => (position + index + 1) % width === 0)
const leftEdge = () => current.some(index => (position + index) % width === 0)
const checkRotatedPosition = () => {
    let pos = position
    if ((pos + 1) % width < 4) {
        if (rightEdge()) {
            position += 1
            checkRotatedPosition()
        }
    } else if (pos % width > 5) {
        if (leftEdge()) {
            position -= 1
            checkRotatedPosition()
        }
    }
}

//add score
const addScore = () => {
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('end'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('end')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//game over
const gameOver = () => {
    if(current.some(index => squares[position + index].classList.contains('end'))) {
        scoreDisplay.innerHTML = 'you lose!'
        clearInterval(timerID)
        document.removeEventListener("keyup", control);  //stops to click on any key

    }
}


//styling instructions

const instructionsColors = [
    `#fff100`, `#ff0096`, `#ff0000`, `#00deff`, `#40757d`, `#0f5183`, `#0f5183`, `#ded303`, `#c11e7f`, `#a91472`, `#00d4f5`, `#40757d`, `#0f5183`, `#0f5183`
]
setInterval(
    function () {
        document.querySelectorAll(".instructions").forEach(el => {
        let randomColor = instructionsColors[Math.floor(Math.random()*instructionsColors.length)]
            el.style.transition = "0.5s"
            el.style.color = randomColor;
        })
    },400);

document.querySelector(".mobile__left").addEventListener('click', function(e) {
    moveLeft()
});
document.querySelector(".mobile__right").addEventListener('click', function(e) {
    moveRight()
});
document.querySelector(".mobile__rotate").addEventListener('click', function(e) {
    rotate()
});
document.querySelector(".mobile__down").addEventListener('click', function(e) {
    moveDown()
});
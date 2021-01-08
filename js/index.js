const grid = document.querySelector('.grid');
const startBtn = document.querySelector('#start');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over')
const gridWidth = 10; // in terms of squares
const gridHeight = 10;
const totalNumberSquares = gridWidth * gridHeight;
const speedChange = 0.99;
let squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let appleIndex = 0;
let score = 0;
let intervalTime = 750; // time in ms between movements
let timerId = 0;
let hardmodeOn = false;



function createGrid() {
    for (let i = 0; i < totalNumberSquares; i++) {
        const square = document.createElement('div');
        square.classList.add('square')
        grid.appendChild(square);
        squares.push(square);
    }
}

createGrid();

function startGame() {
    // Removing the existing snakes and apple
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    squares[appleIndex].classList.remove('apple');

    // Reset timer
    clearInterval(timerId);

    hardmodeOn = document.getElementById('hard-mode').checked;
    currentSnake = [2, 1, 0];
    direction = 1;
    appleIndex = 0;
    score = 0;
    scoreDisplay.textContent = score; // reset score
    gameOverScreen.style.display = 'none';

    const speed = document.querySelector("#speed");
    if (parseInt(speed.value) && (parseInt(speed.value) > 0)) {
        intervalTime = parseInt(speed.value);
    } else {
        intervalTime = 750;
    }
    
    generateApple();

    // Adding a new snake and setting a new motion timer
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    timerId = setInterval(move, intervalTime);

}

function move() {

    // * Checking our end game conditions
    if (
        // if snake hits a wall
        (currentSnake[0] + gridWidth >= (totalNumberSquares) && direction === gridWidth) ||   // if hits bottom
        (currentSnake[0] % gridWidth === (gridWidth - 1) && direction === 1) ||               // if hits right
        (currentSnake[0] % gridWidth === 0 && direction === - 1) ||                           // if hits left
        (currentSnake[0] - gridWidth < 0 && direction === -gridWidth)                         // if hits top

        
    ) {
        
        // Clear game screen if hardmode, show game over
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        currentSnake = [];
        squares[appleIndex].classList.remove('apple');
        gameOverScreen.style.display = 'block';
        
        return clearInterval(timerId);
    }

    // * Moving the snake
    const tail = currentSnake.pop();
    squares[tail].classList.remove('snake');
    currentSnake.unshift(currentSnake[0] + direction);

    // * Snake eating apple functionality
    if (squares[currentSnake[0]].classList.contains('apple')) {
        // remove the apple class
        squares[currentSnake[0]].classList.remove('apple');

        // grow the snake by adding the snake class
        squares[tail].classList.add('snake');

        // grow our snake array
        currentSnake.push(tail);

        // generate a new apple
        generateApple();

        // add one to the score and display it
        score++;
        scoreDisplay.textContent = score;

        // speed up the snake
        clearInterval(intervalTime);
        intervalTime = intervalTime * speedChange;
        timerId = setInterval(move, intervalTime);

    }
    console.log("speed: " + intervalTime);
    squares[currentSnake[0]].classList.add('snake');
}

function generateApple() {

    do {
        appleIndex = Math.floor(Math.random() * totalNumberSquares);
    } while (squares[appleIndex].classList.contains('snake'));

    squares[appleIndex].classList.add('apple');
}

function control(e) {
    if (e.keyCode === 39) { // right arrow
        //direction = 1;
        changeDirection(1);
    } else if (e.keyCode === 38) { // up arrow
        //direction = -gridWidth;
        changeDirection(-gridWidth);
    } else if (e.keyCode === 37) { // left arrow
        //direction = -1;
        changeDirection(-1);
    } else if (e.keyCode === 40) { // down arrow
        //direction = +gridWidth;
        changeDirection(+gridWidth);
    }
}

function changeDirection(newDirection) {
    if (squares[currentSnake[0] + newDirection]) {
        if (!squares[currentSnake[0] + newDirection].classList.contains('snake')) {
            direction = newDirection;
        }
    }
    
    
}
document.addEventListener('keyup', control);
startBtn.addEventListener('click', startGame);
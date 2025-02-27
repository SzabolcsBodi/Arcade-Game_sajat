const board = document.getElementById('game-board');
const instruction = document.getElementById('text')

const score = document.getElementById('score');

const gridSize = 20;
let snake =[{x: 10,y: 10}]
let food = generateFood();
let direction = 'right'
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize)+ 1;
    const y = Math.floor(Math.random() * gridSize)+ 1;
    return {x, y};
}


function move(){
    if (!gameStarted) return;  

    const head = { ...snake[0] };

    switch (direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}



function StartGame(){
    if (gameStarted) return; 
    
    gameStarted = true;
    instruction.style.display = 'none';
    
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(event){
    if(!gameStarted && event.code === 'Space' || !gameStarted && event.key === ' ' ){
        StartGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];


    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();  
        return;
    }


    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();  
            return;
        }
    }
}

function resetGame() {
    stopGame(); 

    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];

    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;

    updateScore();
    draw();  


    instruction.style.display = 'block';
}



function updateScore(){
    const currentscore = snake.length -1;
    score.textContent = currentscore.toString().padStart(3,'0');
}
function stopGame() {
    if (gameInterval) {
        clearInterval(gameInterval);  
        gameInterval = null;  
    }
    gameStarted = false;
    instruction.style.display = 'block';
}



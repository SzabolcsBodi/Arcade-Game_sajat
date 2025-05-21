const board = document.getElementById('game-board');
const instruction = document.getElementById('text');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

let score = 0;
let highScore = 0;
const gridSize = 20;
let snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


function initializeGame() {
    updateScore();
    draw();
    if (!document.keyListenerAdded) {
        document.addEventListener('keydown', handleKeyPress);
        document.keyListenerAdded = true; 
    }
}

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}


function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}


function move() {
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
        increaseScore();
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

function resetGame() {
    console.log('Resetting game...');
    stopGame(); 
    gameStarted = false; 
    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }]; 
    food = generateFood(); 
    direction = 'right'; 
    gameSpeedDelay = 200; 
    resetScore();
    draw(); 
    console.log('Game reset complete.');
}

function stopGame() {
    if (gameInterval) {
        clearInterval(gameInterval); 
        gameInterval = null;
    }
    gameStarted = false; 
    instruction.style.display = 'block'; 
}

function startGame() {
    if (gameStarted) return; 

    gameStarted = true;
    instruction.style.display = 'none';


    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        }
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

function updateScore() {
    scoreElement.textContent = `Score: ${score.toString().padStart(3, '0')}`;
    highScoreElement.textContent = `High Score: ${highScore.toString().padStart(3, '0')}`;
}

function resetScore() {
    score = 0;
    updateScore();
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

document.addEventListener('DOMContentLoaded', initializeGame);

function updateHighScoreInDatabase(highScore) {
    fetch('update_high_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ high_score: highScore }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('High score updated in the database.');
        } else {
            console.error('Failed to update high score:', data.message);
        }
    })
    .catch(error => {
        console.error('Error updating high score:', error);
    });
}

function increaseScore() {
    score += 10; 
    if (score > highScore) {
        highScore = score;
        updateHighScoreInDatabase(highScore); 
    }
    updateScore();
}

function fetchHighScoreFromDatabase() {
    fetch('get_high_score.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            highScore = data.high_score || 0;
            updateScore();
        } else {
            console.error('Failed to fetch high score:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching high score:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchHighScoreFromDatabase(); 
    initializeGame(); 
});
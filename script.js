// Define HTML elements or pick them
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

//Define game variables
const gridSize = 20; // 20px
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let gameStarted = false;
let gameSpeedDelay = 200;
let gameInterval;
let direction = "right";

// Draw game map, snake and food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set postion of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food fucntion
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed(); //
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision(); //
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true; // Indicates that the game is running
  instructionText.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Space press (Keypress) event handler
function handleKeypress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === "")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeypress);

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

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.y < 1 || head.y > gridSize || head.x > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "img/game.png";
flappyImg.width = 65;
flappyImg.height = 65;

// // GAME CONSTANTS
// const FLAP_SPEED = -7;
// const BIRD_WIDTH = 40;
// const BIRD_HEIGHT = 30;
// const PIPE_WIDTH = 50;
// const PIPE_GAP = 125;

// // BIRD VARIABLES
// let birdX = 50;
// let birdY = 50;
// let birdVelocity = 0;
// let birdAcceleration = 0.4;

// // pipe variables
// let pipeX = 400;
// let pipeY = canvas.height - 200;

// GAME CONSTANTS
const FLAP_SPEED = -6;
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// BIRD VARIABLES
let birdX = 100;
let birdY = 100;
let birdVelocity = 0;
let birdAcceleration = 0.4;

// pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

// we add a boolean variables, so we can check when flappy passes we increase the value
let scored = false;

// lets us control the bird with the space key
// Define a function to handle flap action
function flap() {
  birdVelocity = FLAP_SPEED;
}

// Keyboard input (for computers)
document.body.onkeyup = function (e) {
  if (e.code === "Space") {
    flap();
  }
};

canvas.addEventListener("touchstart", function () {
  flap();
});

// lets us restart the game if we hit game-over
document.getElementById("restart").addEventListener("click", function () {
  hideEndMenu();
  resetGame();
  loop();
});

function increaseScore() {
  // increase now our counter when our flappy passes the pipes
  if (
    birdX > pipeX + PIPE_WIDTH &&
    (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
    !scored
  ) {
    score++;
    scoreDiv.innerHTML = score;
    scored = true;
  }
  if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
  }
}

function collisionCheck() {
  // Creat bouding Boxes for the bird and the pipes
  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
  };
  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY,
  };
  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP,
  };

  // Check for collisiob=n with upper pipe box
  if (
    birdBox.x + birdBox.width > topPipeBox.x &&
    birdBox.x < topPipeBox.x + topPipeBox.width &&
    birdBox.y < topPipeBox.y
  ) {
    return true;
  }
  // check for collision with lower pipe box
  if (
    birdBox.x + birdBox.width > bottomPipeBox.x &&
    birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
    birdBox.y + birdBox.height > bottomPipeBox.y
  ) {
    return true;
  }
  // check if bird hits boudaries
  if (birdBox < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }
  return false;
}

function hideEndMenu() {
  document.getElementById("end-menu").style.display = "none";
  gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
  document.getElementById("end-menu").style.display = "block";
  gameContainer.classList.add("backdrop-blur");
  document.getElementById("end-score").innerHTML = score;

  // This way we update always our highscore at the end of our game
  // if we have a higher high score that the previous
  if (highScore < score) {
    highScore = score;
  }
  document.getElementById("best-score").innerHTML = highScore;
}

// we reset the values to the beginning se we start with the bird at the beginning
function resetGame() {
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.2;

  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
}

function endGame() {
  showEndMenu();
}

function loop() {
  //reset the ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Flappy Bird
  ctx.drawImage(flappyImg, birdX, birdY, flappyImg.width, flappyImg.height);

  // Draw Pipes
  ctx.fillStyle = "#ecf72c";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  // add an collision check to display end-menu and end the game
  // the collistionCheck will return us true if we have a collision
  // otherwise false
  if (collisionCheck()) {
    endGame();
    return;
  }

  // move the pipes
  pipeX -= 1.5;

  // if the pipe moves out of the frame we need to reset the pipe
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  // apply gravity to the bird and let it move
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  // always check if you call the fuction
  increaseScore();
  requestAnimationFrame(loop);
}
loop();

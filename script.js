// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Button
const flapBtn = document.getElementById("flapBtn");

// Images
let birdImg = new Image();
birdImg.src = "./bird.png";

let pillarImg = new Image();
pillarImg.src = "./pillar.png";

// Bird physics
let bird = {
    x: 70,
    y: 250,
    width: 40,
    height: 40,
    gravity: 0.3,
    lift: -6,
    velocity: 0
};

// Pipes
let pipes = [];
let pipeGap = 180;
let pipeWidth = 70;
let pipeSpeed = 1.8;

// Ground
let groundHeight = 50;

// Score
let score = 0;
let bestScore = 0;

// Game state
let gameOver = false;

// Background Music
let bgMusic = new Audio("./bg_music.mp3");
bgMusic.loop = true;

// Play music once button is clicked for first time
let musicStarted = false;
flapBtn.addEventListener("click", () => {
    if (!musicStarted) {
        bgMusic.play().catch(() => {});
        musicStarted = true;
    }
    flap();
});

// Bird flap function
function flap() {
    if (!gameOver) {
        bird.velocity = bird.lift;
    }
}

// Spawn pipes
function spawnPipe() {
    let topHeight = Math.random() * (canvas.height - pipeGap - groundHeight - 150) + 60;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        passed: false
    });
}

// Draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        ctx.drawImage(pillarImg, pipe.x, 0, pipeWidth, pipe.topHeight);

        // Bottom pipe
        let bottomY = pipe.topHeight + pipeGap;
        ctx.drawImage(
            pillarImg,
            pipe.x,
            bottomY,
            pipeWidth,
            canvas.height - bottomY - groundHeight
        );
    });
}

// Update pipes
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            score++;
            pipe.passed = true;
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
        spawnPipe();
    }

    if (pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }
}

// Draw bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Update bird
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Hit ground
    if (bird.y + bird.height > canvas.height - groundHeight) {
        bird.y = canvas.height - bird.height - groundHeight;
        triggerGameOver();
    }

    // Hit top
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

// Collision with pipes
function checkCollision() {
    for (let pipe of pipes) {
        let bottomPipeY = pipe.topHeight + pipeGap;
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > bottomPipeY)
        ) {
            triggerGameOver();
        }
    }
}

// Draw ground
function drawGround() {
    ctx.fillStyle = "#DEB887";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

// Draw score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Best: " + bestScore, 10, 60);
}

// Draw Game Over screen
function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2 - 40);
    ctx.font = "24px Arial";
    ctx.fillText("Click RETRY Button", canvas.width/2, canvas.height/2);
}

// Trigger Game Over
function triggerGameOver() {
    if (!gameOver) {
        gameOver = true;
        bgMusic.pause();
        bgMusic.currentTime = 0;
        if (score > bestScore) bestScore = score;
    }
}

// Reset Game
function resetGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    spawnPipe();
}

// Retry via button
flapBtn.addEventListener("click", () => {
    if (gameOver) {
        resetGame();
    }
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();

    if (!gameOver) {
        drawPipes();
        drawBird();
        updatePipes();
        updateBird();
        checkCollision();
        drawScore();
    } else {
        drawPipes();
        drawBird();
        drawScore();
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Start game
spawnPipe();
gameLoop();
  

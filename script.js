// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    gravity: 0.4,
    lift: -7,
    velocity: 0
};

// Pipes
let pipes = [];
let pipeGap = 150;
let pipeWidth = 70;
let pipeSpeed = 2;

// Background Music
let bgMusic = new Audio("./bg_music.mp3");
bgMusic.loop = true;

// Play music after first tap
document.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
});

// Flap
document.addEventListener("click", () => {
    bird.velocity = bird.lift;
});

// Spawn pipes
function spawnPipe() {
    let topHeight = Math.random() * (canvas.height - pipeGap - 150) + 60;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight
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
            canvas.height - bottomY
        );
    });
}

// Update pipes
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Spawn new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
    }

    // Remove off-screen pipes
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

    if (bird.y < 0) bird.y = 0;
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
    }
}

// Collision detection
function checkCollision(pipe) {
    // Pipe positions
    let bottomPipeY = pipe.topHeight + pipeGap;

    // Bird hit top pipe
    if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        bird.y < pipe.topHeight
    ) {
        return true;
    }

    // Bird hit bottom pipe
    if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        bird.y + bird.height > bottomPipeY
    ) {
        return true;
    }

    return false;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPipes();
    drawBird();

    updatePipes();
    updateBird();

    // Check collisions
    for (let pipe of pipes) {
        if (checkCollision(pipe)) {
            location.reload(); // restart game
        }
    }

    requestAnimationFrame(gameLoop);
}

spawnPipe();
gameLoop();
          

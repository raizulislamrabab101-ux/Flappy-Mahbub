const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let bird = {
    x: 100,
    y: canvasHeight/2,
    width: 50,
    height: 50,
    gravity: 0.5,
    lift: -10,
    velocity: 0
};

let pillars = [];
let gap = 150;
let pillarWidth = 80;
let frame = 0;
let score = 0;

// Load images
let birdImg = new Image();
birdImg.src = "bird.png"; // Replace with your friend’s head image filename

let pillarImg = new Image();
pillarImg.src = "pillar.png"; // Replace with your pillar image filename

// Load audio
let bgMusic = new Audio("bg_music.mp3"); // Replace with your background music filename
bgMusic.loop = true;
bgMusic.play();

let gameOverSound = new Audio("game_over.wav"); // Replace with your game-over sound filename

// Handle jump
document.addEventListener("keydown", function(e){
    if(e.code === "Space") {
        bird.velocity = bird.lift;
    }
});
document.addEventListener("click", function(){
    bird.velocity = bird.lift;
});

// Pillar constructor
function Pillar(x) {
    this.x = x;
    this.height = Math.random() * (canvasHeight - gap - 100) + 50;
    this.topY = 0;
    this.bottomY = this.height + gap;
}

function resetGame() {
    bird.y = canvasHeight/2;
    bird.velocity = 0;
    pillars = [];
    score = 0;
    frame = 0;
}

function update() {
    frame++;

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Add new pillars
    if(frame % 90 === 0) {
        pillars.push(new Pillar(canvasWidth));
    }

    // Move pillars
    for(let i=0; i<pillars.length; i++){
        pillars[i].x -= 2;
    }

    // Collision detection
    for(let i=0; i<pillars.length; i++){
        let p = pillars[i];
        if(
            bird.x < p.x + pillarWidth &&
            bird.x + bird.width > p.x &&
            (bird.y < p.height || bird.y + bird.height > p.bottomY)
        ) {
            gameOverSound.play();
            resetGame();
        }
    }

    // Check top/bottom
    if(bird.y + bird.height > canvasHeight || bird.y < 0) {
        gameOverSound.play();
        resetGame();
    }

    // Update score
    for(let i=0; i<pillars.length; i++){
        if(pillars[i].x + pillarWidth === bird.x){
            score++;
        }
    }
}

function draw() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw pillars
    for(let i=0; i<pillars.length; i++){
        let p = pillars[i];
        // top
        ctx.drawImage(pillarImg, p.x, 0, pillarWidth, p.height);
        // bottom
        ctx.drawImage(pillarImg, p.x, p.bottomY, pillarWidth, canvasHeight - p.bottomY);
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
      

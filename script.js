const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const FLAP_STRENGTH = -15;
const SPAWN_RATE = 90; // Pipe spawn rate (frames)
const PIPE_WIDTH = 60;
const PIPE_SPACING = 300; // Distance between pipes

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: GRAVITY,
    flap: FLAP_STRENGTH,
};

let pipes = [];
let score = 0;
let isGameOver = false;

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Handle keyboard input
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isGameOver) {
        bird.velocity = bird.flap;
    } else if (isGameOver && event.code === "Enter") {
        resetGame();
    }
});

// Update game objects
function update() {
    if (isGameOver) return;

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipe movement and collision
    if (pipes.length > 0) {
        pipes.forEach((pipe, index) => {
            pipe.x -= 3;

            // Detect collision with bird
            if (
                bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + PIPE_WIDTH &&
                (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
            ) {
                isGameOver = true;
            }

            // Remove passed pipes
            if (pipe.x + PIPE_WIDTH < 0) {
                pipes.splice(index, 1);
                score++;
            }
        });
    }

    // Add new pipes at intervals
    if (Math.random() < 1 / SPAWN_RATE) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: pipeHeight + PIPE_SPACING,
        });
    }

    // Check for ground or ceiling collision
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        isGameOver = true;
    }
}

// Draw game objects
function draw() {
    // Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bird
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Pipes
    ctx.fillStyle = "#32CD32";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });

    // Score
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Game Over message
    if (isGameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press Enter to Restart", canvas.width / 3.5, canvas.height / 1.5);
    }
}

// Reset the game to the initial state
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
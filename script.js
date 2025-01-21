// Grid setup
const grid = document.getElementById('grid');
const cells = [];
for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
    cells.push(cell);
}

// Game variables
let shooterIndex = 217; // Start position for shooter
let invaderIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let bossIndex = -1; // Boss starts as not spawned
let score = 0;
let timeLeft = 60;
let level = 1;
let invaderSpeed = 1000; // Initial speed
let invaderInterval;
let timerInterval;

// Shooter setup
cells[shooterIndex].classList.add('shooter');
document.addEventListener('keydown', moveShooter);

function moveShooter(e) {
    cells[shooterIndex].classList.remove('shooter');
    if (e.key === 'ArrowLeft' && shooterIndex % 15 !== 0) {
        shooterIndex--;
    } else if (e.key === 'ArrowRight' && shooterIndex % 15 !== 14) {
        shooterIndex++;
    }
    cells[shooterIndex].classList.add('shooter');
}

// Invaders movement
function moveInvaders() {
    const reachedBottom = invaderIndices.some(index => index >= 210);
    if (reachedBottom) {
        gameOver('Game Over! Invaders reached the bottom.');
        return;
    }

    invaderIndices.forEach(index => cells[index]?.classList.remove('invader'));
    invaderIndices = invaderIndices.map(index => index + 15);
    invaderIndices.forEach(index => {
        if (index < 225) cells[index]?.classList.add('invader');
    });

    if (invaderIndices.length === 0 && bossIndex === -1) {
        spawnBoss();
    }
}

function spawnBoss() {
    bossIndex = 112; // Middle of the grid
    cells[bossIndex]?.classList.add('boss');
    level++;
    invaderSpeed = Math.max(200, invaderSpeed - 200);
    clearInterval(invaderInterval);
    invaderInterval = setInterval(moveInvaders, invaderSpeed);
}

// Bullet movement
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        let bulletIndex = shooterIndex - 15;

        function moveBullet() {
            if (bulletIndex < 0) {
                clearInterval(bulletInterval);
                return;
            }

            cells[bulletIndex]?.classList.remove('bullet');

            if (cells[bulletIndex]?.classList.contains('invader')) {
                cells[bulletIndex]?.classList.remove('invader');
                invaderIndices = invaderIndices.filter(index => index !== bulletIndex);
                updateScore();
                clearInterval(bulletInterval);
                checkWin();
                return;
            }

            if (bulletIndex === bossIndex) {
                cells[bossIndex]?.classList.remove('boss');
                bossIndex = -1;
                updateScore();
                clearInterval(bulletInterval);
                checkWin();
                return;
            }

            bulletIndex -= 15;
            if (bulletIndex >= 0) cells[bulletIndex]?.classList.add('bullet');
        }

        const bulletInterval = setInterval(moveBullet, 100);
    }
});

// Timer logic
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('time').textContent = timeLeft;
        } else {
            clearInterval(timerInterval);
            gameOver("Time's up!");
        }
    }, 1000);
}

// Game over
function gameOver(message) {
    alert(message);
    clearInterval(timerInterval);
    clearInterval(invaderInterval);
}

// Scoring
function updateScore() {
    score += 10;
    document.getElementById('score').textContent = score;
}

function checkWin() {
    if (invaderIndices.length === 0 && bossIndex === -1) {
        gameOver('You Win! All enemies defeated!');
    }
}

// Start game
function startGame() {
    invaderIndices.forEach(index => cells[index].classList.add('invader'));
    invaderInterval = setInterval(moveInvaders, invaderSpeed);
    startTimer();
}

startGame();

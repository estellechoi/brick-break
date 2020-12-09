const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d"); // 2D rendering context
// ball's defaul (x, y)
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
// how far a ball goes each time
let dx = 2;
let dy = -2;
// ball radius
const ballRadius = 10;
// paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // positioned at the center
// key value
let rightPressed = false;
let leftPressed = false;
// bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
//score
let score = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, alive: true };
    }
}

// key handling
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function keyDownHandler(e) {
    console.log('keyDownHandler', e.keyCode, typeof e.keyCode);
    if(e.keyCode === 39)
        rightPressed = true;
    else if (e.keyCode === 37)
        leftPressed = true;
}

function keyUpHandler(e) {
    if(e.keyCode === 39)
        rightPressed = false;
    else if (e.keyCode === 37)
        leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width)
        paddleX = relativeX - (paddleWidth / 2);
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].alive) {
                let x = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let y = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = x;
                bricks[c][r].y = y;

                ctx.beginPath();
                ctx.rect(x, y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function detectCollision() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.alive) {
                if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
                    dy = -dy;
                    bricks[c][r].alive = false;
                    score += 1;
                    if(score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        // document.location.reload();
                        // window.clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }           
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives " + lives, canvas.width - 65, 20);
}

function draw() {
    // clear everything as covered by a clearing rect shaped from x,y to x,y
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw ball & paddle
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    detectCollision();

    // move ball's (x, y)
    ballX += dx;
    ballY += dy;

    // turn ball's direction when hitting 3 each inner wall of canvas
    // game over if hit the bottom wall
    if (ballY < ballRadius)
        dy = -dy;
    else if (ballY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth)
            dy = -dy;
        else {
            // clearInterval(interval);
            lives -= 1;
            if (lives) {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            } else {
                document.location.reload();
                alert("GAME OVER");
            }
        }
    }

    if (ballX < ballRadius || ballX > canvas.width - ballRadius)
        dx = -dx;

    // move paddle by 7px
    if (rightPressed && paddleX < canvas.width - paddleWidth)
        paddleX += 7;
    else if (leftPressed && paddleX > 0)
        paddleX -= 7;

    requestAnimationFrame(draw);
}


// const interval = window.setInterval(draw, 10);
draw();

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50); // x, y, w, h
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();


// ctx.beginPath();
// ctx.arc(240, 80, 20, 0, Math.PI * 1, false) // x, y, 반지름, 시작 radian, 끝 radian, 시계방향
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();

//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdXPosition = boardWidth/8;
let birdYPosition = boardHeight/2;
let birdImage;

let bird = {
    x: birdXPosition,
    y: birdYPosition,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeXPosition = boardWidth;
let pipeYPosition = 0;

let topPipeImage;
let bottomPipeImage;

//physics
let velocityX = -2; //velocity of the pipes moving towards the bird
let velocityY = 0; //velocity of the bird
let gravity = 0.1;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw bird
    birdImage = new Image();
    birdImage.src = "./media/flappybird.png";
    birdImage.onload = function() {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    //load pipes images
    topPipeImage = new Image();
    topPipeImage.src = "./media/toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./media/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
    document.addEventListener("mousedown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    if(gameOver)
        return;

    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height)
        gameOver = true;

    //pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.image, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //there are two pipes for gate
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe))
            gameOver = true;
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width < 0) {
        pipeArray.shift();
    }

    //score rendering
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    //GAME OVER TEXT
    if(gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if(gameOver)
        return;

    let randomPipeY = pipeYPosition - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = pipeHeight/4;

    let topPipe = {
        image: topPipeImage,
        x: pipeXPosition,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        image: bottomPipeImage,
        x: pipeXPosition,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "touchstart" || e.type == "mousedown") {
        velocityY = -4.5;
        
        //reset game
        if(gameOver) {
            bird.y = birdYPosition;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}
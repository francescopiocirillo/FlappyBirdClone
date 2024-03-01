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
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //bird
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    //pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.image, pipe.x, pipe.y, pipe.width, pipe.height);
    }

}

function placePipes() {
    let topPipe = {
        image: topPipeImage,
        x: pipeXPosition,
        y: pipeYPosition,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
}
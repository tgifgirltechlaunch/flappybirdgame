//can use the following window onload 
//hack with html img tag to load images
//the way I used it hear
window.onload = function () {
    const c = document.getElementById('canvas');
    newgame = document.getElementById('newgame');

    //avoid sizing canvas with css. Use javascript.
    c.width = window.innerWidth;
    c.height = 600;

    //object interface that has methods for communicating between canvas and graphic card
    const ctx = c.getContext('2d');
    
    const environment = new Environment(c, ctx);
    const ground = new Ground(c, ctx);
    const bird = new Bird(300, 300, ctx);
    const scoresound = new Sound("../sounds/score.wav");
    loadPipes();
    const theme = new Sound("../sounds/theme.mp3");
    const pipes = [];
    let pipeSet = generateRandomPipes(ctx, c.width, c.height);
    pipes.push(pipeSet.top, pipeSet.bottom);
    setInterval(function () {
        let pipeSet = generateRandomPipes(ctx, c.width, c.height);
        pipes.push(pipeSet.top, pipeSet.bottom);
    }, 2600);
    const score = new Score(bird, pipes, c, ctx);

    gameLoop();

    
    /*
       Main Game Loop
    */
    function gameLoop() {
        bird.update(pipes);

        if (!bird.dead) {
            environment.update();
            ground.update();
            pipes.forEach(function(pipe1){
                pipe1.update();
                score.update(pipes, scoresound);
            });
            
            theme.play();
        }

        environment.render();
        ground.render();
        pipes.forEach(function(pipe1){
            pipe1.render();
        });
        bird.render();
        score.render();
        
        if (bird.dead){
            theme.stop();
            drawGameOver(ctx, c);
            newgame.style.display = 'inline';
        } 
         
        
        window.requestAnimationFrame(gameLoop);
    }
};

function generateRandomPipes(ctx, canvasWidth, canvasHeight) {
    let lengthTop = Math.round(Math.random() * 200 + 50);
    let lengthBottom = canvasHeight - 250 - lengthTop;
    let returnVal = { };
    
    returnVal.top = new Pipe(canvasWidth, -5, lengthTop, 4, ctx, pipeUp);
    returnVal.bottom = new Pipe(canvasWidth, canvasHeight + 5 - lengthBottom, lengthBottom, 4, ctx, pipeBottom);
    
    return returnVal;
}

function drawGameOver(ctx, c) {
    // ctx.font = "30px Verdana";
    // ctx.textAlign = "center";
    // ctx.fillText("Game Over!!", c.width / 2, c.height / 2);

    var gameover = document.createElement("div");
    gameover.classList.add('gameover-container');
    gameover.setAttribute("style", `position: absolute; z-index: 99; top: ${(c.height/2) - 150}px; left: ${(c.width/2)-150}px; width: 300px; height: 300px; background: url(../images/flappygameover.jpg);`);
    document.body.appendChild(gameover);
    
}

function newGame(){
    window.location.reload();
}

function loadPipes()
{
    pipeUp = new Image();
    pipeUp.src = '../images/pipet.png';
    pipeBottom = new Image();
    pipeBottom.src = "../images/pipeb.png";
  
}
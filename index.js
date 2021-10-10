const grid = document.querySelector('.grid');
const startBtn = document.getElementById('start');
const scoreDisplay = document.getElementById('score');
let squares = [];
let currentSnake = [2,1,0];
let direction = 1;
const width = 10;
let appleIndex = 0;
let bombIndex = 0;
let bombs = [];
let intervalBomb = 8000;
let bombTimer = 0;
let score = 0;
let intervalTime = 900;
let speed = 0.9;
let timerId = 0;

// Rendering game field
function creatGrid () {
    for (let i = 0; i < width*width; i++){
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)
        squares.push(square)
    }
}

creatGrid()

currentSnake.forEach(index => squares[index].classList.add('snake'))

//Starting the game
function startgame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove('apple') // deleting apple
    // deleting bombs
    for (let i = 0; i < bombs.length; i++){
        bombIndex = bombs[i]
        squares[bombIndex].classList.remove('bomb')
    }
    
    clearInterval(timerId)
    clearInterval(bombTimer)
    currentSnake = [2,1,0]
    bombs = []
    score = 0
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 900
    intervalBomb = 8000
    bombTimer = setInterval(generateBomb, intervalBomb) //generate bombs
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    generateApple()
    timerId = setInterval(move, intervalTime)
    
}

// snake moving

function move() {
    if (
      (currentSnake[0] + width >= width*width && direction === width)  ||  //if snake has hit bottom
      (currentSnake[0] % width === width-1 && direction === 1) ||    //if snake has hit right wall
      (currentSnake[0] % width === 0 && direction === -1) ||   //if snake has hit left wall
      (currentSnake[0] - width < 0 && direction === -width) ||    //if snake has hit top
      squares[currentSnake[0] + direction].classList.contains('snake') || // if the snake has hit its self
      squares[currentSnake[0] + direction].classList.contains('bomb') // if snake has hit a bomb
    )
    return gameOver()
    
    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    currentSnake.unshift(currentSnake[0] + direction)
    
    // adding snake's tail after eating an apple
    if(squares[currentSnake[0]].classList.contains('apple')){
       squares[currentSnake[0]].classList.remove('apple') 
       squares[tail].classList.add('snake')
       currentSnake.push(tail)
       squares[currentSnake[0]].classList.add('snake')
       generateApple()
       score++
       scoreDisplay.textContent = score
       clearInterval(timerId)
       intervalTime = intervalTime * speed
       timerId = setInterval(move, intervalTime)
    } 
    else {
        squares[currentSnake[0]].classList.add('snake')
    }  
}

//generating apples and checking that apple cannot generate on a bomb and snake
function generateApple() {
     do {
        appleIndex =  Math.floor(Math.random() * squares.length)
        }
     while ((squares[appleIndex].classList.contains('snake')) || (squares[appleIndex].classList.contains('bomb'))) 
     squares[appleIndex].classList.add('apple')
}

generateApple()

//generating two bombs and checking that bomb cannot generate on an apple and snake
function generateBomb() {
    let bombCreated = false;
    bombIndex = Math.floor(Math.random() * squares.length)
    
             if (!squares[bombIndex].classList.contains('snake') && !squares[bombIndex].classList.contains('apple')) {
           bombCreated = true
           
             if(bombCreated){
               squares[bombIndex].classList.add('bomb')
                bombs.push(bombIndex) 
        
                 if (bombs.length <= 2) {
                    setTimeout (generateBomb, intervalBomb);
            } else
               {
                  let bombsRemoved = bombs.shift() 
                  squares[bombsRemoved].classList.remove('bomb')
               }
         } 
    }  
}

//end of the game
function gameOver(){
    clearInterval(timerId)
    clearInterval(bombTimer)
    scoreDisplay.innerHTML = `${score} <span class="end">Game over!</span>`
}

// controlling snake moving
function control(e) {
    if (e.key === "ArrowRight") {
        direction = 1
    } else if (e.key === "ArrowUp") {
        direction = -width
    } else if (e.key === "ArrowLeft") {
        direction = -1
    } else if (e.key === "ArrowDown") {
        direction = +width
    }
}
document.addEventListener('keyup', control)
startBtn.addEventListener('click', startgame)
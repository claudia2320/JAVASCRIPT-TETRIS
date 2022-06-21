import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";

document.addEventListener('DOMContentLoaded', () => {

    //DEFINING ALL CONSTANTS FOR FURTHER FUNCTIONS
    const goButton = document.querySelector('.button') //play button on game screen
    const userScore = document.querySelector('.score-display') //Score depends on lines covered (every line gone is worth 10 points)
    const linesGone = document.querySelector('.lines-score') 

    let currentTetrominoIndex = 0
    let currentTetrominoRotation = 0
    let currentTetromigameOvenoPosition = 4

    let score = 0
    let lines = 0
    let timerId 
    let nextrandom = 0

    //CREATING GRID WITH A FUCNTION
    //To create the grid, avoiding manually typing divs 200 times, I defined some variables
    const width = 10
    const height = 20
    const dimensions = width * height
    const grid = createGrid(); //This calls the function that created the grid and createTetrominos the grid on screen
    let cells = Array.from(grid.querySelectorAll('div'))

    function createGrid() {
        //Creates the main grid with a for loop
        let grid = document.querySelector(".grid")
        for (let i = 0; i < dimensions; i++) {
          let gridElement = document.createElement("div")
          grid.appendChild(gridElement)
        }
    
        //The shapes of the game fall in the middle of the grid but should stop once they collide with the bottom of grid
        //Adding cells to the bottom of the grid so that the other shapes settle on top
        for (let i = 0; i < width; i++) {
          let gridElement = document.createElement("div")
          gridElement.setAttribute("class", "block3") //Green blocks form a line in the bottom of grid
          grid.appendChild(gridElement)
        }
    
        //This part of the function shows the up next shape that will appear on the main grid
        let previousGrid = document.querySelector(".previous-grid")

        for (let i = 0; i < 16; i++) {
          let gridElement = document.createElement("div")
          previousGrid.appendChild(gridElement);
        }
        return grid;
      }
    
    


    //The shapes in a tetris game are called tetrominoes and I've defined them in the following arrays
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    //Appending the tetromino arrays to a list so that then it is easier to select a random one 
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    //Creating a list with all the coloured blocks to create the tetrominoes
    const tetrominoColours = [
      'url(images/blue_block.png)',
      'url(images/pink_block.png)',
      'url(images/purple_block.png)',
      'url(images/peach_block.png)',
      'url(images/yellow_block.png)'
    ]

  
    //Getting computer keys to move the tetrominoes 
    function control(e) {
      if (e.keyCode === 39)
        moveright() //Make tetromino move right
      else if (e.keyCode === 38)
        rotate() //Make tetromino rotate
      else if (e.keyCode === 37)
        moveleft() //Make tetromino move left
      else if (e.keyCode === 40)
        moveDown() //Make tetromino move down
    }
  
    // To make the shapes move down without the user pressing any buttons
    document.addEventListener('keydown', control)

  
    //Randomly select a tetromino from theTetrominoes array and then wrote a function to createTetromino them on the screen
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let currentTetromino = theTetrominoes[random][currentTetrominoRotation]

    function createTetromino() {
      currentTetromino.forEach(index => {
        cells[currentTetrominoPosition + index].classList.add('block')
        cells[currentTetrominoPosition + index].style.backgroundImage = tetrominoColours[random]
      })
    }
  
    //UncreateTetromino the tetromino
    function uncreateTetromino() {
      currentTetromino.forEach(index => {
        cells[currentTetrominoPosition + index].classList.remove('block')
        cells[currentTetrominoPosition + index].style.backgroundImage = 'none'
      })
    }
  
    //FUNCTIONS TO MOVE THE TETROMINOES
    //Although user is not pressing any button, the tetromino will move down cell by cell
    function moveDown() {
      uncreateTetromino()
      currentTetrominoPosition = currentTetrominoPosition += width //width of the cell
      createTetromino()
      settleTetromino()
    }

    goButton.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        createTetromino()
        timerId = setInterval(moveDown, 1000)
        nextrandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
      }
    })
  
    //Move the tetromino right with right button
    function moveright() {
      uncreateTetromino()
      const isAtRightEdge = currentTetromino.some(index => (currentTetrominoPosition + index) % width === width - 1)
      if (!isAtRightEdge) currentTetrominoPosition += 1
      if (currentTetromino.some(index => cells[currentTetrominoPosition + index].classList.contains('block2'))) {
        currentTetrominoPosition -= 1
      }
      createTetromino()
    }
  
    //Move tetromino to the left with the left button
    function moveleft() {
      uncreateTetromino()
      const isAtLeftEdge = currentTetromino.some(index => (currentTetrominoPosition + index) % width === 0)
      if (!isAtLeftEdge) currentTetrominoPosition -= 1
      if (currentTetromino.some(index => cells[currentTetrominoPosition + index].classList.contains('block2'))) {
        currentTetrominoPosition += 1
      }
      createTetromino()
    }

    //Rotate the tetrominoes around
    function rotate() {
      uncreateTetromino()
      currentTetrominoRotation++
      if (currentTetrominoRotation === currentTetromino.length) {
        currentTetrominoRotation = 0
      }
      currentTetromino = theTetrominoes[random][currentTetrominoRotation]
      createTetromino()
    }
  
    //Function to settle the tetromino when it reaches the bottom of the grid or other tetrominoes that are already in the grid
    function settleTetromino() {
      // if block has settled
      if (currentTetromino.some(index => cells[currentTetrominoPosition + index + width].classList.contains('block3') || cells[currentTetrominoPosition + index + width].classList.contains('block2'))) {
        // make it block2
        currentTetromino.forEach(index => cells[index + currentTetrominoPosition].classList.add('block2'))
        // start a new tetromino falling
        random = nextrandom
        nextrandom = Math.floor(Math.random() * theTetrominoes.length)
        currentTetromino = theTetrominoes[random][currentTetrominoRotation]
        currentTetrominoPosition = 4
        createTetromino()
        displayShape()
        addToScore()
        gameOver()
      }
    }
    settleTetromino()

  
    //The game ends when a vertical line of tetrominoes reaches the top of the grid 
    function gameOver() {
      if (currentTetromino.some(index => cells[currentTetrominoPosition + index].classList.contains('block2'))) {
        userScore.innerHTML = 'END'
        clearInterval(timerId)
        gameOverAlert()
        document.location.reload();
      }
    }

    function gameOverAlert() {
        alert("GAME OVER!")}


    //COMING NEXT MINI GRID 
    const nextTetrSize = 4
    const cells2 = document.querySelectorAll('.previous-grid div')
    let displayIndex = 0
    
    //Defining the smaller tetrominoes for the coming next grid
    const smallTetrominoes = [
      [1, nextTetrSize + 1, nextTetrSize * 2 + 1, 2], /* lTetromino */
      [0, nextTetrSize, nextTetrSize + 1, nextTetrSize * 2 + 1], /* zTetromino */
      [1, nextTetrSize, nextTetrSize + 1, nextTetrSize + 2], /* tTetromino */
      [0, 1, nextTetrSize, nextTetrSize + 1], /* oTetromino */
      [1, nextTetrSize + 1, nextTetrSize * 2 + 1, nextTetrSize * 3 + 1] /* iTetromino */
    ]

    function displayShape() {
      cells2.forEach(square => {
        square.classList.remove('block')
        square.style.backgroundImage = 'none'
      })
      smallTetrominoes[nextrandom].forEach(index => {
        cells2[displayIndex + index].classList.add('block')
        cells2[displayIndex + index].style.backgroundImage = tetrominoColours[nextrandom]
      })
    }
  
    //DISPLAYING THE SCORE IN THE RIGHT HAND SIZE GRID
    function addToScore() {
      for (currentTetrominoIndex = 0; currentTetrominoIndex < dimensions; currentTetrominoIndex += width) {
        const row = [currentTetrominoIndex, currentTetrominoIndex + 1, currentTetrominoIndex + 2, currentTetrominoIndex + 3, currentTetrominoIndex + 4, currentTetrominoIndex + 5, currentTetrominoIndex + 6, currentTetrominoIndex + 7, currentTetrominoIndex + 8, currentTetrominoIndex + 9]
        if (row.every(index => cells[index].classList.contains('block2'))) {
          score += 10
          lines += 1
          userScore.innerHTML = score
          linesGone.innerHTML = lines
          row.forEach(index => {
            cells[index].style.backgroundImage = 'none'
            cells[index].classList.remove('block2') || cells[index].classList.remove('block')
          })
          
          //splice array
          const cellsRemoved = cells.splice(currentTetrominoIndex, width)
          cells = cellsRemoved.concat(cells)
          cells.forEach(cell => grid.appendChild(cell))
        }
      }
    }

})


  
  
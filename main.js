const DEAD = 0;
const ALIVE = 1;
const rows = 50;
const cols = 50;
const cellSize = 15;
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const boardArea = document.getElementById('boardArea');
let drag = false;
let lifeBoard = make2DArray(cols, rows);    // make board

window.addEventListener('mousedown', () => {
    drag = true;
})

window.addEventListener('mouseup', () => {
    drag = false;
})

function make2DArray(cols, rows) {
    let array = [];
    for (let i = 0; i < rows; i++) {
        array[i] = new Array(cols).fill(DEAD);
    }
    return array;
}

function setup() {
    draw();
    let simulation;

    startBtn.addEventListener('click', () => {
        simulation = setInterval(getNextGeneration, 100);
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(simulation);
    })
}

function draw() {
    // create table to make cells
    const table = document.createElement('table');
    table.setAttribute('style', `width: ${cellSize * cols}px; height: ${cellSize * rows}px;`);

    // generate cell rows
    for (let i = 0; i < rows; i++) {
        const tr = table.insertRow();

        // generate cells inside the rows
        for (let j = 0; j < cols; j++) {
            const cell = tr.insertCell();
            cell.classList.add('cell');
            cell.classList.add(lifeBoard[i][j] === ALIVE ? 'alive' : 'dead');

            // change cell status when clicked and redraw
            cell.addEventListener('click', () => {
                const cellCol = cell.cellIndex;
                const cellRow = tr.rowIndex;
    
                lifeBoard[cellRow][cellCol] = lifeBoard[cellRow][cellCol] === ALIVE ? DEAD : ALIVE;
                table.remove();   // remove table
                draw();    // redraw board
            })
            cell.addEventListener('mousemove', () => {
                if (drag) {
                    const cellCol = cell.cellIndex;
                    const cellRow = tr.rowIndex;
        
                    lifeBoard[cellRow][cellCol] = ALIVE;
                    table.remove();   // remove table
                    draw();    // redraw board
                }
            })
        }
    }

    boardArea.appendChild(table);   // add board to body
}

/*
 * Calculate number of live neighbors
 */
function calculateNeighbors(yIndex, xIndex) {
    let topRow = (yIndex - 1) < 0 ? rows - 1 : yIndex - 1;
    let middleRow = yIndex;
    let bottomRow = (yIndex + 1) === rows ? 0 : yIndex + 1;
    let leftColumn = (xIndex - 1) < 0 ? cols - 1 : xIndex - 1;
    let middleColumn = xIndex;
    let rightColumn = (xIndex + 1) === cols ? 0 : xIndex + 1;
    let count = 0;

    count += lifeBoard[topRow][middleColumn]    // top middle
    count += lifeBoard[topRow][rightColumn]     // top right
    count += lifeBoard[topRow][leftColumn]      // top left
    count += lifeBoard[middleRow][leftColumn]   // middle left
    count += lifeBoard[middleRow][rightColumn]  // middle right
    count += lifeBoard[bottomRow][leftColumn]   // bottom left
    count += lifeBoard[bottomRow][middleColumn] // bottom middle
    count += lifeBoard[bottomRow][rightColumn]  // bottom right

    return count;
}

/*
 * Conway Game of Life Generation Transitions:
 * Any live cell with fewer than two live neighbours dies, as if by underpopulation.
 * Any live cell with two or three live neighbours lives on to the next generation.
 * Any live cell with more than three live neighbours dies, as if by overpopulation.
 * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 * 
 * Condensed,
 * Any live cell with two or three live neighbours survives.
 * Any dead cell with three live neighbours becomes a live cell.
 * All other live cells die in the next generation. Similarly, all other dead cells stay dead
 */
function getNextGeneration() {
    let nextGenBoard = make2DArray(cols, rows);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const liveNeighbors = calculateNeighbors(i, j);
            const isCellAlive = lifeBoard[i][j] === ALIVE;
            if (isCellAlive) {
                if (liveNeighbors === 2 || liveNeighbors === 3) {
                    nextGenBoard[i][j] = ALIVE;
                } else {
                    nextGenBoard[i][j] = DEAD;
                }
            } else {
                if (liveNeighbors === 3) {
                    nextGenBoard[i][j] = ALIVE;
                } else {
                    nextGenBoard[i][j] = DEAD;
                }
            }
        }
    }

    lifeBoard = nextGenBoard;
    document.getElementsByTagName('table')[0].remove();
    draw();
}

window.onload = function() {
    setup();
}
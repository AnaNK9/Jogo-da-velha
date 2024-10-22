const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('mode'); 
let currentPlayer = 'X'; 
let board = Array(9).fill(null);
let gameOver = false;
let isComputerPlaying = false;
let stats = {
    X: 0,
    O: 0,
    draw: 0
};

 
if (localStorage.getItem('ticTacToeStats')) {
    stats = JSON.parse(localStorage.getItem('ticTacToeStats'));
    updateStats();
}

 
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Sons
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');

// Eventos de clique para cada célula
cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', resetGame);

function handleClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] || gameOver) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
        handleGameOver(`${currentPlayer} venceu!`);
        if (currentPlayer === 'X') stats.X++; 
        else stats.O++;
        winSound.play();
        updateStats();
    } else if (board.every(cell => cell)) {
        handleGameOver('Empate!');
        stats.draw++;
        drawSound.play(tie.wav);
        updateStats();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (modeSelect.value !== 'human' && currentPlayer === 'O') {
            isComputerPlaying = true;
            setTimeout(computerMove, 500); 
        }
    }
}

function computerMove() {
    let index;
    const difficulty = modeSelect.value;

    if (difficulty === 'easy') {
         
        const emptyCells = board.map((val, index) => val === null ? index : null).filter(v => v !== null);
        index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'hard') {
        
        index = getBestMove(); 
    }

    if (index !== undefined && !gameOver) {
        board[index] = 'O';
        cells[index].textContent = 'O';

        if (checkWin()) {
            handleGameOver(`O venceu!`);
            stats.O++;
            winSound.play(win.mp3);
            updateStats();
        } else if (board.every(cell => cell)) {
            handleGameOver('Empate!');
            stats.draw++;
            drawSound.play(tie.wav);
            updateStats();
        } else {
            currentPlayer = 'X'; 
            isComputerPlaying = false;
        }
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function handleGameOver(resultMessage) {
    message.textContent = resultMessage;
    gameOver = true;
    const winningCombination = winningCombinations.find(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });

    if (winningCombination) {
        winningCombination.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
}

function resetGame() {
    board = Array(9).fill(null);
    gameOver = false;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
    message.textContent = '';

    if (modeSelect.value !== 'human' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);  
    }
}

function updateStats() {
    localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
    document.getElementById('stats').textContent = `Vitórias X: ${stats.X} | Vitórias O: ${stats.O} | Empates: ${stats.draw}`;
}

 
function getBestMove() {
    
    const emptyCells = board.map((val, index) => val === null ? index : null).filter(v => v !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];  
}

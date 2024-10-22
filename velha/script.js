
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('mode');
const modal = document.getElementById('gameOverModal');
const modalMessage = document.getElementById('gameOverMessage');
const closeBtn = document.querySelector('.close'); // Seleção de modo de jogo
let currentPlayer = 'X'; // Jogador inicial
let board = Array(9).fill(null);
let gameOver = false;
let isComputerPlaying = false;
let stats = {
    X: 0,
    O: 0,
    draw: 0
};
localStorage.removeItem('ticTacToeStats');
resetGame();

// Recuperar o histórico de jogos do localStorage
if (localStorage.getItem('ticTacToeStats')) {
    stats = JSON.parse(localStorage.getItem('ticTacToeStats'));
    updateStats();
}

// Padrões de vitória (linhas, colunas e diagonais)
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

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


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

    if (currentPlayer === 'X') {
        e.target.classList.add('animate-x'); // Adicionar a animação para "X"
        e.target.innerHTML = '<div class="x">X</div>'; // Mostrar o X com efeito
    } else {
        e.target.classList.add('animate-o'); // Adicionar a animação para "O"
        e.target.innerHTML = '<div class="o">O</div>'; // Mostrar o O com efeito
    }
    

    if (checkWin()) {
        handleGameOver(`${currentPlayer} venceu!`);
        if (currentPlayer === 'X') stats.X++; // Atualizar stats
        else stats.O++;
        winSound.play();
        updateStats();
    } else if (board.every(cell => cell)) {
        handleGameOver('Empate!');
        stats.draw++;
        drawSound.play();
        updateStats();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (modeSelect.value !== 'human' && currentPlayer === 'O') {
            isComputerPlaying = true;
            setTimeout(computerMove, 500); // Jogada automática do computador
        }
    }
}

function computerMove() {
    let index;
    const difficulty = modeSelect.value;

    if (difficulty === 'easy') {
        // Jogada aleatória
        const emptyCells = board.map((val, index) => val === null ? index : null).filter(v => v !== null);
        index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (difficulty === 'hard') {
        // Implementar uma estratégia mais avançada (Minimax pode ser usado aqui)
        index = getBestMove(); // Simplificado para não deixar celulas vazias.
    }

    if (index !== undefined && !gameOver) {
        board[index] = 'O';
        cells[index].textContent = 'O';

        if (checkWin()) {
            handleGameOver(`O venceu!`);
            stats.O++;
            winSound.play();
            updateStats();
        } else if (board.every(cell => cell)) {
            handleGameOver('Empate!');
            stats.draw++;
            drawSound.play();
            updateStats();
        } else {
            currentPlayer = 'X'; // Volta para o jogador humano
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
    gameOver = true;
    modalMessage.textContent = resultMessage;
    modal.style.display = "flex";
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
        setTimeout(computerMove, 500); // Começar com o computador se for selecionado
    }
}

function updateStats() {
    localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
    document.getElementById('stats').textContent = `Vitórias X: ${stats.X} | Vitórias O: ${stats.O} | Empates: ${stats.draw}`;
}

// Função para calcular o melhor movimento (para a dificuldade difícil)
function getBestMove() {
    // Implementação simplificada para retorno de jogada "inteligente"
    const emptyCells = board.map((val, index) => val === null ? index : null).filter(v => v !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]; // Apenas aleatória por simplicidade
}

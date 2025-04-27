const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const emojiReaction = document.getElementById('emoji-reaction');
const playBotBtn = document.getElementById('play-bot');
const iconXSelect = document.getElementById('icon-x');
const iconOSelect = document.getElementById('icon-o');

let currentPlayer = 'X';
let gameActive = true;
let board = Array(9).fill("");
let playAgainstBot = false;
let iconX = "❌";
let iconO = "⭕";

let playerXScore = 0;
let playerOScore = 0;

const backgroundMusic = new Audio('background-music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;
backgroundMusic.play();

iconXSelect.addEventListener('change', () => {
    iconX = iconXSelect.value;
});

iconOSelect.addEventListener('change', () => {
    iconO = iconOSelect.value;
});

playBotBtn.addEventListener('click', () => {
    playAgainstBot = true;
    alert('Now playing vs Bot!');
});

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    cell.innerHTML = currentPlayer === 'X' ? iconX : iconO;

    cell.classList.add('animated');
    setTimeout(() => {
        cell.classList.remove('animated');
    }, 500);

    checkWinner();

    if (playAgainstBot && currentPlayer === 'O' && gameActive) {
        setTimeout(botMove, 500);
    }
}

function checkWinner() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightCells(a, b, c);
            statusText.innerHTML = `🎉 ${currentPlayer === 'X' ? 'Player X' : 'Player O'} Wins! 🎉`;
            emojiReaction.textContent = "🏆😎🏆";
            updateScore(currentPlayer);
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "Draw!";
        gameActive = false;
        emojiReaction.textContent = "🤝😅🤝";
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `${currentPlayer === 'X' ? 'Player X' : 'Player O'}'s Turn`;
    }
}

function highlightCells(a, b, c) {
    const cells = document.querySelectorAll('.cell');
    cells[a].classList.add('highlight');
    cells[b].classList.add('highlight');
    cells[c].classList.add('highlight');
}

function updateScore(player) {
    if (player === 'X') {
        playerXScore++;
        document.getElementById('playerXScore').textContent = playerXScore;
    } else {
        playerOScore++;
        document.getElementById('playerOScore').textContent = playerOScore;
    }
}

function minimax(board, depth, isMaximizingPlayer) {
    const winner = checkForWinner(board);
    if (winner !== null) {
        return winner === 'O' ? 1 : -1;
    }
    if (board.every(cell => cell !== "")) {
        return 0;
    }
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = isMaximizingPlayer ? 'O' : 'X';
            const score = minimax(board, depth + 1, !isMaximizingPlayer);
            board[i] = "";
            bestScore = isMaximizingPlayer ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }
    return bestScore;
}

function bestMove(board) {
    let bestCell = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestCell = i;
            }
        }
    }
    return bestCell;
}

function botMove() {
    let bestCell = bestMove(board);
    board[bestCell] = 'O';
    const cells = document.querySelectorAll('.cell');
    cells[bestCell].innerHTML = iconO;

    checkWinner();
}

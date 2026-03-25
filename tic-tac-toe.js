document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.ttt-cell');
    const turnDisplay = document.getElementById('turn-display');
    const resetBtn = document.getElementById('reset-btn');
    const modeBtn = document.getElementById('mode-btn');
    const historyList = document.getElementById('ttt-history');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let playVsAI = false;

    const WINNING_CONDITIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Load history
    renderHistory();

    modeBtn.addEventListener('click', () => {
        playVsAI = !playVsAI;
        modeBtn.textContent = playVsAI ? 'Play vs Human' : 'Play vs AI';
        resetGame();
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (board[index] !== '' || !isGameActive) return;

        makeMove(index, currentPlayer);

        if (playVsAI && isGameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        cells[index].style.color = player === 'X' ? 'var(--accent-1)' : 'var(--accent-2)';
        
        checkResult();
    }

    function makeAIMove() {
        if (!isGameActive) return;

        // Simple Random AI
        const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
            const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            makeMove(randomIndex, 'O');
        }
    }

    function checkResult() {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
            const [a, b, c] = WINNING_CONDITIONS[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            turnDisplay.innerHTML = `<span class="win-text">Player ${currentPlayer} Wins!</span>`;
            isGameActive = false;
            highlightWinningCells(winningLine);
            saveResult(`Player ${currentPlayer} Won`);
            return;
        }

        if (!board.includes('')) {
            turnDisplay.textContent = 'Game Ended in a Draw!';
            isGameActive = false;
            saveResult('Draw');
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnDisplay.textContent = `Player ${currentPlayer}'s Turn ${playVsAI && currentPlayer === 'O' ? '(AI Thinking...)' : ''}`;
    }

    function highlightWinningCells(indices) {
        indices.forEach(idx => {
            cells[idx].style.background = 'var(--nav-bg)';
            cells[idx].style.boxShadow = 'inset 0 0 10px var(--accent-1)';
        });
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameActive = true;
        turnDisplay.textContent = "Player X's Turn";
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.background = '';
            cell.style.boxShadow = '';
        });
    }

    function saveResult(outcome) {
        const gameType = playVsAI ? 'vs AI' : 'vs Human';
        saveScore('ttt-score', { outcome, type: gameType });
        renderHistory();
    }

    function renderHistory() {
        if (typeof displayScores === 'function') {
            displayScores('ttt-score', 'ttt-history', (score) => {
                return `${score.outcome} <small>(${score.type})</small> - <small>${score.date}</small>`;
            });
        }
    }
});

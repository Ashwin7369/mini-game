document.addEventListener('DOMContentLoaded', () => {
    const memoryBoard = document.getElementById('memory-board');
    const movesDisplay = document.getElementById('moves-display');
    const timerDisplay = document.getElementById('timer-display');
    const resetBtn = document.getElementById('reset-btn');
    const winMessage = document.getElementById('win-message');
    const historyList = document.getElementById('memory-history');

    const icons = [
        'fa-star', 'fa-heart', 'fa-bolt', 'fa-cloud',
        'fa-moon', 'fa-sun', 'fa-music', 'fa-leaf'
    ];
    let cardsArray = [...icons, ...icons];
    
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval = null;
    let isLocked = false;

    renderHistory();
    initGame();

    resetBtn.addEventListener('click', initGame);

    function initGame() {
        cardsArray.sort(() => 0.5 - Math.random());
        memoryBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        timer = 0;
        isLocked = false;
        
        movesDisplay.textContent = `Moves: ${moves}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        winMessage.classList.add('hidden');
        winMessage.parentElement.insertBefore(winMessage, historyList.parentElement); 

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);

        createBoard();
    }

    function createBoard() {
        cardsArray.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icon;

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="memory-card-back">
                        <i class="fa-solid fa-question"></i>
                    </div>
                </div>
            `;
            card.addEventListener('click', flipCard);
            memoryBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (isLocked) return;
        if (this === flippedCards[0]) return;
        
        this.classList.add('flipped');
        
        if (flippedCards.length === 0) {
            flippedCards[0] = this;
            return;
        }
        
        flippedCards[1] = this;
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = flippedCards[0].dataset.icon === flippedCards[1].dataset.icon;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);
        
        matchedPairs++;
        resetBoard();

        if (matchedPairs === icons.length) {
            clearInterval(timerInterval);
            winMessage.classList.remove('hidden');
            saveGameResult();
        }
    }

    function unflipCards() {
        isLocked = true;
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, isLocked] = [[], false];
    }

    function saveGameResult() {
        saveScore('memory-score', { moves, time: timer });
        renderHistory();
    }

    function renderHistory() {
        if (typeof displayScores === 'function') {
            displayScores('memory-score', 'memory-history', (score) => {
                return `Time: ${score.time}s | Moves: ${score.moves} - <small>${score.date}</small>`;
            });
        }
    }
});

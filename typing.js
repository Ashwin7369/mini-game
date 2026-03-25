document.addEventListener('DOMContentLoaded', () => {
    const paragraphDisplay = document.getElementById('paragraph-display');
    const typeInput = document.getElementById('type-input');
    const wpmDisplay = document.getElementById('wpm-display');
    const accuracyDisplay = document.getElementById('accuracy-display');
    const timerDisplay = document.getElementById('timer-display');
    const resetBtn = document.getElementById('reset-btn');
    const resultMessage = document.getElementById('result-message');
    const finalStats = document.getElementById('final-stats');
    const historyList = document.getElementById('typing-history');

    const paragraphs = [
        "The quick brown fox jumps over the lazy dog. This sentence contains all letters of the English alphabet.",
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
        "Technology is constantly evolving, changing how we interact with the world around us. Keeping up is essential.",
        "A journey of a thousand miles begins with a single step. Be patient with yourself when learning new skills."
    ];

    let currentText = '';
    let timeLeft = 0;
    let timerInterval = null;
    let isTestActive = false;
    let totalTyped = 0;
    let errors = 0;

    renderHistory();
    initGame();

    resetBtn.addEventListener('click', () => {
        initGame();
        typeInput.value = '';
    });

    typeInput.addEventListener('input', () => {
        if (!isTestActive && typeInput.value.length > 0) {
            startTest();
        }

        const arrayQuote = paragraphDisplay.querySelectorAll('span');
        const arrayValue = typeInput.value.split('');

        let isCorrect = true;
        totalTyped = arrayValue.length;
        errors = 0;

        arrayQuote.forEach((characterSpan, index) => {
            const character = arrayValue[index];
            if (character == null) {
                characterSpan.classList.remove('correct');
                characterSpan.classList.remove('incorrect');
                
                if (index === arrayValue.length) {
                    characterSpan.classList.add('current');
                } else {
                    characterSpan.classList.remove('current');
                }
                isCorrect = false;
            } else if (character === characterSpan.innerText) {
                characterSpan.classList.add('correct');
                characterSpan.classList.remove('incorrect');
                characterSpan.classList.remove('current');
            } else {
                characterSpan.classList.remove('correct');
                characterSpan.classList.add('incorrect');
                characterSpan.classList.remove('current');
                errors++;
                isCorrect = false;
            }
        });

        // Current char if no value yet
        if (arrayValue.length === 0) {
            arrayQuote[0].classList.add('current');
        }

        // Calculate interim accuracy
        if (totalTyped > 0) {
            const accuracy = Math.round(((totalTyped - errors) / totalTyped) * 100);
            accuracyDisplay.textContent = `Accuracy: ${Math.max(0, accuracy)}%`;
        }

        if (totalTyped === arrayQuote.length) {
            finishTest();
        }
    });

    function initGame() {
        currentText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        paragraphDisplay.innerHTML = '';
        currentText.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            paragraphDisplay.appendChild(characterSpan);
        });
        paragraphDisplay.querySelector('span').classList.add('current');

        typeInput.value = '';
        typeInput.disabled = false;
        
        isTestActive = false;
        timeLeft = 0;
        totalTyped = 0;
        errors = 0;
        clearInterval(timerInterval);

        wpmDisplay.textContent = 'WPM: 0';
        accuracyDisplay.textContent = 'Accuracy: 100%';
        timerDisplay.textContent = 'Time: 0s';
        
        resultMessage.classList.add('hidden');
        typeInput.focus();
    }

    function startTest() {
        isTestActive = true;
        timerInterval = setInterval(() => {
            timeLeft++;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            
            // Live WPM update
            const wordsTyped = (totalTyped - errors) / 5;
            const wpm = Math.round((wordsTyped / timeLeft) * 60);
            wpmDisplay.textContent = `WPM: ${Math.max(0, wpm || 0)}`;
        }, 1000);
    }

    function finishTest() {
        clearInterval(timerInterval);
        isTestActive = false;
        typeInput.disabled = true;

        const wordsTyped = (totalTyped - errors) / 5;
        const wpm = timeLeft > 0 ? Math.round((wordsTyped / timeLeft) * 60) : 0;
        const accuracy = Math.round(((totalTyped - errors) / totalTyped) * 100);

        finalStats.innerHTML = `${Math.max(0, wpm)} WPM | ${Math.max(0, accuracy)}% Accuracy | ${timeLeft}s Time`;
        resultMessage.classList.remove('hidden');

        saveGameResult(Math.max(0, wpm), Math.max(0, accuracy), timeLeft);
    }

    function saveGameResult(wpm, accuracy, time) {
        saveScore('typing-score', { wpm, accuracy, time });
        renderHistory();
    }

    function renderHistory() {
        if (typeof displayScores === 'function') {
            displayScores('typing-score', 'typing-history', (score) => {
                return `${score.wpm} WPM | ${score.accuracy}% Acc - <small>${score.date}</small>`;
            });
        }
    }
});

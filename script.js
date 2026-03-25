// General Script for Theme and Shared Logic

document.addEventListener('DOMContentLoaded', () => {
    // ---- THEME MANAGEMENT ----
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const body = document.body;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let currentTheme = body.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Optional: Play a tiny click sound if we had one
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
});

// ---- LEADERBOARD MANAGEMENT ----
// Game Keys: 'ttt-score', 'memory-score', 'typing-score'

function saveScore(gameKey, scoreDetails) {
    let scores = getScores(gameKey);
    scores.push({
        ...scoreDetails,
        date: new Date().toLocaleDateString()
    });

    // Sort scores based on game type
    if (gameKey === 'ttt-score') {
        // Just keep latest
        scores = scores.slice(-5);
    } else if (gameKey === 'memory-score') {
        // Lowest time or moves is better
        scores.sort((a, b) => a.moves - b.moves || a.time - b.time);
        scores = scores.slice(0, 5);
    } else if (gameKey === 'typing-score') {
        // Highest WPM is better
        scores.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
        scores = scores.slice(0, 5);
    }

    localStorage.setItem(gameKey, JSON.stringify(scores));
    return scores;
}

function getScores(gameKey) {
    const scores = localStorage.getItem(gameKey);
    return scores ? JSON.parse(scores) : [];
}

function displayScores(gameKey, containerId, formatFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scores = getScores(gameKey);
    if (scores.length === 0) {
        container.innerHTML = '<li>No scores yet! Play a game.</li>';
        return;
    }

    container.innerHTML = '';
    scores.forEach((score, index) => {
        const li = document.createElement('li');
        const formatted = formatFn(score, index);
        li.innerHTML = `<span><i class="fa-solid fa-medal"></i> ${index + 1}</span> <span>${formatted}</span>`;
        container.appendChild(li);
    });
}

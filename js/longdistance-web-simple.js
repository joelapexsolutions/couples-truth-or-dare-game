/**
 * Long Distance Truth or Dare - Simplified Web Version
 * Web users are just "remote controls" - mobile app handles all game logic
 */

// Simple game state - just for display
const webState = {
    sessionCode: null,
    playerName: '',
    partnerName: '',
    isConnected: false,
    sessionStartTime: null
};

// Firebase listeners
let gameListener = null;
let presenceRefs = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initSimpleWebGame();
});

/**
 * Initialize the simplified web game
 */
function initSimpleWebGame() {
    console.log('Initializing Simplified Web Game...');
    
    if (!initializeFirebase()) {
        showAlert('Unable to connect to game servers. Please refresh and try again.');
        return;
    }

    setupEventListeners();
    loadSavedPlayerName();
    showSection('joinSection');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Join game
    document.getElementById('joinGameButton').addEventListener('click', joinGame);
    
    // Auto-format game code
    const gameCodeInput = document.getElementById('gameCode');
    gameCodeInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    // Game action buttons - these just send responses to mobile app
    document.getElementById('truthButton').addEventListener('click', () => sendResponse('truth'));
    document.getElementById('dareButton').addEventListener('click', () => sendResponse('dare'));
    document.getElementById('completedButton').addEventListener('click', () => sendResponse('completed'));
    document.getElementById('skippedButton').addEventListener('click', () => sendResponse('skipped'));
    
    // Game controls
    document.getElementById('leaveGameButton').addEventListener('click', leaveGame);
    
    // Results screen
    document.getElementById('newGameButton').addEventListener('click', () => showSection('joinSection'));
    document.getElementById('backHomeButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Modal close
    document.getElementById('closeAlert').addEventListener('click', () => {
        document.getElementById('alertModal').classList.add('hidden');
    });
}

/**
 * Load saved player name
 */
function loadSavedPlayerName() {
    const saved = localStorage.getItem('webPlayerName');
    if (saved) {
        document.getElementById('playerName').value = saved;
    }
}

/**
 * Join a game session
 */
async function joinGame() {
    const playerName = document.getElementById('playerName').value.trim();
    const gameCode = document.getElementById('gameCode').value.trim();

    if (!playerName) {
        showAlert('Please enter your name');
        return;
    }

    if (!gameCode || gameCode.length !== 6) {
        showAlert('Please enter a valid 6-character game code');
        return;
    }

    localStorage.setItem('webPlayerName', playerName);
    showLoading('Connecting to game...');

    try {
        // Check if game exists
        const gameCheck = await FirebaseUtils.checkGameCode(gameCode);
        
        if (!gameCheck.exists) {
            hideLoading();
            showAlert('Game not found. Please check the code and try again.');
            return;
        }

        if (!gameCheck.joinable) {
            hideLoading();
            showAlert('This game is no longer available to join.');
            return;
        }

        // Join the session
        await FirebaseUtils.joinGameSession(gameCode, { playerName });

        // Set state
        webState.sessionCode = gameCode;
        webState.playerName = playerName;
        webState.partnerName = gameCheck.hostName || 'Partner';
        webState.sessionStartTime = Date.now();

        // Set up listeners
        setupGameListeners();
        presenceRefs = FirebaseUtils.setupPresence(gameCode, 'player2');

        hideLoading();
        showSection('gameSection');
        updateBasicUI();

    } catch (error) {
        hideLoading();
        console.error('Error joining game:', error);
        showAlert('Failed to join game: ' + error.message);
    }
}

/**
 * Set up game listeners - just listen for updates from mobile app
 */
function setupGameListeners() {
    if (!webState.sessionCode) return;

    gameListener = FirebaseUtils.listenToGameState(webState.sessionCode, (sessionData) => {
        if (!sessionData) {
            showAlert('Game session has ended.');
            cleanup();
            showSection('joinSection');
            return;
        }

        handleGameUpdate(sessionData);
    });
}

/**
 * Handle game updates from mobile app
 */
function handleGameUpdate(sessionData) {
    // Update connection status
    if (sessionData.players?.player1?.connected) {
        webState.isConnected = true;
        updateConnectionStatus();
    }

    // Handle game state updates sent by mobile app
    if (sessionData.gameState) {
        updateGameDisplay(sessionData.gameState);
    }

    // Handle question sent by mobile app
    if (sessionData.currentQuestion) {
        displayQuestion(sessionData.currentQuestion);
    }

    // Handle timer sent by mobile app
    if (sessionData.timer) {
        handleTimer(sessionData.timer);
    }

    // Handle game completion
    if (sessionData.status === 'completed') {
        showResults(sessionData.results);
    }
}

/**
 * Update game display with data from mobile app
 */
function updateGameDisplay(gameState) {
    // Update level and round
    document.getElementById('levelDisplay').textContent = gameState.level || 'Soft';
    document.getElementById('roundDisplay').textContent = `${gameState.currentRound || 1}/${gameState.totalRounds || 4}`;

    // Update points
    document.getElementById('player1PointsDisplay').textContent = gameState.player1Points || 0;
    document.getElementById('player2PointsDisplay').textContent = gameState.player2Points || 0;

    // Update turn indicator
    const isMyTurn = gameState.currentPlayerIndex === 2;
    const turnElement = document.getElementById('currentPlayerName');
    
    if (isMyTurn) {
        turnElement.textContent = 'Your Turn';
        document.getElementById('currentPlayerTurn').classList.add('pulse-animation');
        showChoiceButtons();
    } else {
        turnElement.textContent = `${webState.partnerName}'s Turn`;
        document.getElementById('currentPlayerTurn').classList.remove('pulse-animation');
        hideAllButtons();
    }
}

/**
 * Display question sent by mobile app
 */
function displayQuestion(questionData) {
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.textContent = questionData.text || 'Question received';
    
    // Show completion buttons for the person who got the question
    if (questionData.forPlayer === 'player2') {
        hideChoiceButtons();
        showCompletionButtons();
    }
}

/**
 * Handle timer from mobile app
 */
function handleTimer(timerData) {
    const timerContainer = document.getElementById('timerContainer');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (timerData.duration > 0) {
        timerContainer.classList.remove('hidden');
        startSimpleTimer(timerData.duration);
    } else {
        timerContainer.classList.add('hidden');
    }
}

/**
 * Simple timer countdown
 */
function startSimpleTimer(seconds) {
    const timerDisplay = document.getElementById('timerDisplay');
    let timeLeft = seconds;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('timerContainer').classList.add('hidden');
        }
        timeLeft--;
    }, 1000);
}

/**
 * Send response to mobile app
 */
async function sendResponse(responseType) {
    if (!webState.sessionCode) return;

    try {
        await FirebaseUtils.sendWebResponse(webState.sessionCode, {
            type: responseType,
            timestamp: Date.now(),
            playerKey: 'player2'
        });

        // Hide buttons after sending response
        hideAllButtons();
        
        // Show waiting message
        document.getElementById('questionDisplay').textContent = 'Response sent! Waiting for partner...';

    } catch (error) {
        console.error('Error sending response:', error);
        showAlert('Failed to send response. Please try again.');
    }
}

/**
 * Show/hide button sets
 */
function showChoiceButtons() {
    document.getElementById('choiceButtons').classList.remove('hidden');
    document.getElementById('taskCompletionButtons').classList.add('hidden');
}

function showCompletionButtons() {
    document.getElementById('choiceButtons').classList.add('hidden');
    document.getElementById('taskCompletionButtons').classList.remove('hidden');
}

function hideAllButtons() {
    document.getElementById('choiceButtons').classList.add('hidden');
    document.getElementById('taskCompletionButtons').classList.add('hidden');
}

/**
 * Update basic UI elements
 */
function updateBasicUI() {
    document.getElementById('partnerNameDisplay').textContent = webState.partnerName;
    document.getElementById('player1NameDisplay').textContent = webState.partnerName;
    document.getElementById('player2NameDisplay').textContent = 'You';
    document.getElementById('gameCodeSmall').textContent = webState.sessionCode;
    updateConnectionStatus();
}

/**
 * Update connection status
 */
function updateConnectionStatus() {
    const statusDot = document.getElementById('partnerStatusDot');
    
    if (webState.isConnected) {
        statusDot.classList.add('online');
    } else {
        statusDot.classList.remove('online');
    }
}

/**
 * Show results
 */
function showResults(results) {
    if (!results) return;

    // Determine winner
    let resultMessage;
    if (results.player1Points > results.player2Points) {
        resultMessage = `${webState.partnerName} wins!`;
    } else if (results.player2Points > results.player1Points) {
        resultMessage = "You win!";
    } else {
        resultMessage = "It's a tie! You're both winners! ❤️";
    }

    // Update results display
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('finalPlayer1Name').textContent = webState.partnerName;
    document.getElementById('finalPlayer2Name').textContent = 'You';
    document.getElementById('finalPlayer1Points').textContent = results.player1Points || 0;
    document.getElementById('finalPlayer2Points').textContent = results.player2Points || 0;
    
    document.getElementById('sessionDuration').textContent = `${results.sessionDuration || 0} min`;
    document.getElementById('questionsAnswered').textContent = results.questionsAnswered || 0;
    document.getElementById('connectionScore').textContent = (results.player1Points || 0) + (results.player2Points || 0);

    cleanup();
    showSection('resultsSection');
}

/**
 * Leave game
 */
function leaveGame() {
    if (confirm('Are you sure you want to leave the game?')) {
        cleanup();
        showSection('joinSection');
    }
}

/**
 * Cleanup when leaving/ending game
 */
function cleanup() {
    if (webState.sessionCode) {
        FirebaseUtils.cleanupSession(webState.sessionCode, 'player2');
    }

    if (gameListener) {
        gameListener.off();
        gameListener = null;
    }

    // Reset state
    webState.sessionCode = null;
    webState.partnerName = '';
    webState.isConnected = false;
    webState.sessionStartTime = null;
}

/**
 * Utility functions
 */
function showSection(sectionId) {
    const sections = ['joinSection', 'gameSection', 'resultsSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.toggle('hidden', id !== sectionId);
        }
    });
}

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    
    if (overlay) {
        if (messageEl) messageEl.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function showAlert(message) {
    const modal = document.getElementById('alertModal');
    const messageEl = document.getElementById('alertMessage');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.remove('hidden');
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
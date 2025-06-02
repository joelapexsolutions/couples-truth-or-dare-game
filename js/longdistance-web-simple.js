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

    // ADD THIS LINE HERE:
    setupCommunicationHandlers();
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
 * Set up game listeners - listen for all game updates
 */
function setupGameListeners() {
    if (!webState.sessionCode) return;

    // Main game listener
    gameListener = FirebaseUtils.listenToGameState(webState.sessionCode, (sessionData) => {
        if (!sessionData) {
            showAlert('Game session has ended or no longer exists.');
            cleanup();
            showSection('joinSection');
            return;
        }

        handleGameUpdate(sessionData);
    });

    // Connection monitoring
    setupConnectionMonitoring();
    
    // Listen for partner disconnect
    const partnerRef = firebase.database().ref(`sessions/${webState.sessionCode}/players/player1/connected`);
    partnerRef.on('value', (snapshot) => {
        const isConnected = snapshot.val();
        if (isConnected === false && webState.isConnected) {
            showAlert('Your partner has disconnected from the game.');
        }
        webState.isConnected = isConnected;
        updateConnectionStatus();
    });

    // Listen for shared questions from mobile user
    const sharedQuestionRef = firebase.database().ref(`sessions/${webState.sessionCode}/sharedQuestion`);
    sharedQuestionRef.on('value', (snapshot) => {
        const questionData = snapshot.val();
        if (questionData && questionData.forPlayer === 'player1') {
            // Display shared question
            const questionDisplay = document.getElementById('questionDisplay');
            questionDisplay.innerHTML = `
                <div class="question-content">
                    <div class="question-header">
                        <span class="question-type">${questionData.type.toUpperCase()}</span>
                        <span class="question-for">for ${webState.partnerName}</span>
                    </div>
                    <div class="question-text">${questionData.text}</div>
                    <p class="turn-prompt">Watch ${webState.partnerName} complete this challenge!</p>
                </div>
            `;
            hideAllButtons(); // Web user just watches
        }
    });
}
/**
 * Set up connection monitoring
 */
function setupConnectionMonitoring() {
    const connectedRef = firebase.database().ref('.info/connected');
    
    connectedRef.on('value', (snapshot) => {
        if (snapshot.val() === true) {
            console.log('Connected to Firebase');
            hideConnectionLostMessage();
        } else {
            console.log('Disconnected from Firebase');
            showConnectionLostMessage();
        }
    });
}

/**
 * Show connection lost message
 */
function showConnectionLostMessage() {
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.innerHTML = `
        <div class="connection-lost">
            <i class="fas fa-wifi" style="color: #dc3545; font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Connection lost. Trying to reconnect...</p>
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    hideAllButtons();
}

/**
 * Hide connection lost message
 */
function hideConnectionLostMessage() {
    const questionDisplay = document.getElementById('questionDisplay');
    if (questionDisplay.textContent.includes('Connection lost')) {
        questionDisplay.textContent = 'Reconnected! Waiting for game updates...';
    }
}

/**
 * Handle game updates from mobile app
 */
function handleGameUpdate(sessionData) {
    console.log('Game update received:', sessionData);
    
    // Update connection status
    if (sessionData.players?.player1?.connected) {
        webState.isConnected = true;
        updateConnectionStatus();
    } else {
        webState.isConnected = false;
        updateConnectionStatus();
        // Check if partner left
        if (sessionData.players?.player1?.connected === false) {
            showAlert('Your partner has left the game.');
            cleanup();
            showSection('joinSection');
            return;
        }
    }

    // Handle game state updates
    if (sessionData.gameState) {
        updateGameDisplay(sessionData.gameState);
    }

    // Listen for any question-related updates in the session
    // The mobile app might be storing current question differently
    if (sessionData.currentQuestion || sessionData.question || sessionData.activeQuestion) {
        const questionData = sessionData.currentQuestion || sessionData.question || sessionData.activeQuestion;
        displaySharedQuestion(questionData);
    }

    // Check for web response from mobile app (when mobile generates question for web user)
    if (sessionData.webResponse && sessionData.webResponse.playerKey === 'player2') {
        // Clear the response so it doesn't repeat
        FirebaseUtils.clearWebResponse(webState.sessionCode);
    }

    // Handle game completion
    if (sessionData.status === 'completed') {
        showResults(sessionData.results || sessionData.gameResults);
    }

    // Handle disconnection
    if (sessionData.status === 'disconnected') {
        showAlert('Connection lost. Your partner may have disconnected.');
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

    // Update turn indicator and show appropriate buttons
    const isMyTurn = gameState.currentPlayerIndex === 2;
    const turnElement = document.getElementById('currentPlayerName');
    
    if (isMyTurn) {
        turnElement.textContent = 'Your Turn - Choose Truth or Dare';
        document.getElementById('currentPlayerTurn').classList.add('pulse-animation');
        
        // Only show choice buttons if no question is displayed
        const questionDisplay = document.getElementById('questionDisplay');
        if (!questionDisplay.textContent.includes('TRUTH') && !questionDisplay.textContent.includes('DARE')) {
            showChoiceButtons();
        }
    } else {
        turnElement.textContent = `${webState.partnerName}'s Turn`;
        document.getElementById('currentPlayerTurn').classList.remove('pulse-animation');
        hideAllButtons(); // Hide all buttons when it's partner's turn
    }
}

/**
 * Display question that both players should see
 */
function displaySharedQuestion(questionData) {
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <span class="question-type">${questionData.type.toUpperCase()}</span>
                <span class="question-for">for ${questionData.forPlayer === 'player1' ? webState.partnerName : 'You'}</span>
            </div>
            <div class="question-text">${questionData.text}</div>
        </div>
    `;
    
    // Show appropriate buttons based on whose turn it is
    if (questionData.forPlayer === 'player2') {
        // It's my turn to answer
        showCompletionButtons();
        document.getElementById('questionDisplay').innerHTML += `<p class="turn-prompt">Your turn! Complete this challenge:</p>`;
    } else {
        // Partner is answering
        hideAllButtons();
        document.getElementById('questionDisplay').innerHTML += `<p class="turn-prompt">Watch ${webState.partnerName} complete this challenge!</p>`;
    }
}

/**
 * Display question generated specifically for web user
 */
function displayWebQuestion(questionData) {
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <span class="question-type">${questionData.type.toUpperCase()}</span>
                <span class="question-for">for You</span>
            </div>
            <div class="question-text">${questionData.text}</div>
            <p class="turn-prompt">Your turn! Complete this challenge:</p>
        </div>
    `;
    
    hideChoiceButtons();
    showCompletionButtons();
    
    // Handle timer if provided
    if (questionData.timer > 0) {
        handleTimer({ duration: questionData.timer });
    }
}

showCommunicationOptions();

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
        if (responseType === 'truth' || responseType === 'dare') {
            // Send choice to mobile app and wait for question
            await FirebaseUtils.sendWebResponse(webState.sessionCode, {
                type: 'choice',
                choice: responseType,
                timestamp: Date.now(),
                playerKey: 'player2'
            });

            // Show waiting message and hide buttons
            document.getElementById('questionDisplay').textContent = `You chose ${responseType.toUpperCase()}! Waiting for your question...`;
            hideAllButtons();
            
            // Set up a one-time listener for the question response
            listenForQuestionResponse();
            
        } else {
            // Send completion status
            await FirebaseUtils.sendWebResponse(webState.sessionCode, {
                type: 'completion',
                completed: responseType === 'completed',
                timestamp: Date.now(),
                playerKey: 'player2'
            });

            document.getElementById('questionDisplay').textContent = 'Response sent! Waiting for next turn...';
            hideAllButtons();
        }

    } catch (error) {
        console.error('Error sending response:', error);
        showAlert('Failed to send response. Please try again.');
        // Re-enable buttons on error
        if (responseType === 'truth' || responseType === 'dare') {
            showChoiceButtons();
        } else {
            showCompletionButtons();
        }
    }
}

/**
 * Listen for question response after web user makes a choice
 */
function listenForQuestionResponse() {
    const responseRef = firebase.database().ref(`sessions/${webState.sessionCode}/questionResponse`);
    
    responseRef.once('value', (snapshot) => {
        const questionData = snapshot.val();
        if (questionData && questionData.forPlayer === 'player2') {
            // Display the question
            displayWebQuestion(questionData);
            
            // Clear the response
            responseRef.remove();
        }
    });
    
    // Set timeout in case no response comes
    setTimeout(() => {
        const questionDisplay = document.getElementById('questionDisplay');
        if (questionDisplay.textContent.includes('Waiting for your question')) {
            questionDisplay.textContent = 'No question received. Please try selecting Truth or Dare again.';
            showChoiceButtons();
        }
    }, 10000); // 10 second timeout
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

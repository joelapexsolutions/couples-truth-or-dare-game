/**
 * Long Distance Truth or Dare - Simplified Web Version - COMPLETE FIXED
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
    
    // Always set up event listeners first, regardless of Firebase status
    setupEventListeners();
    loadSavedPlayerName();
    showSection('joinSection');
    
    // Then check Firebase (but don't block if it fails)
    if (!initializeFirebase()) {
        console.warn('Firebase initialization failed, but UI is ready');
        // Don't show alert immediately - let user try to join and then show error
    } else {
        console.log('Firebase ready');
    }

    // Load long distance questions
    if (typeof loadLongDistanceQuestions === 'function') {
        loadLongDistanceQuestions();
        console.log('Long distance questions loaded for web');
    }
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

    // Join game - DEBUG VERSION
const joinButton = document.getElementById('joinGameButton');
console.log('Join button found:', joinButton);

if (joinButton) {
    console.log('Adding click listener to join button');
    joinButton.addEventListener('click', function() {
        console.log('JOIN BUTTON CLICKED!');
        joinGame();
    });
    console.log('Click listener added successfully');
} else {
    console.error('JOIN BUTTON NOT FOUND!');
}
    
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

    // Setup communication handlers
    setupCommunicationHandlers();
}

/**
 * Setup communication options for responses
 */
function setupCommunicationHandlers() {
    // Communication handlers are already integrated into the completion flow
    console.log('Communication handlers ready');
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

    // Handle shared questions (when mobile user plays)
    if (sessionData.sharedQuestion) {
        displaySharedQuestion(sessionData.sharedQuestion);
    }

    // Handle web-specific questions (when web user plays)
    if (sessionData.questionResponse && sessionData.questionResponse.forPlayer === 'player2') {
        displayWebQuestion(sessionData.questionResponse);
        FirebaseUtils.clearQuestionResponse(webState.sessionCode);
    }

    // Handle game completion and disconnection
    if (sessionData.status === 'completed') {
        showResults(sessionData.results || sessionData.gameResults);
    }

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

    // Check if it's web player's turn
    const isMyTurn = gameState.currentPlayerIndex === 2; // Web player is always player2
    const turnElement = document.getElementById('currentPlayerName');
    const currentPlayerTurn = document.getElementById('currentPlayerTurn');
    const questionDisplay = document.getElementById('questionDisplay');
    
    if (isMyTurn) {
        turnElement.textContent = 'Your Turn';
        if (currentPlayerTurn) {
            currentPlayerTurn.classList.add('pulse-animation');
            currentPlayerTurn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }
        
        // Clear any previous shared questions and show choice buttons for new turn
        const hasActiveWebQuestion = questionDisplay.innerHTML.includes('for You');
        
        if (!hasActiveWebQuestion) {
            // It's a new turn for web player - clear content and show choices
            questionDisplay.innerHTML = 'Your turn! Choose Truth or Dare:';
            showChoiceButtons();
            console.log('New turn for web player - showing choice buttons');
        } else {
            // Player already has a question for this turn
            showCompletionButtons();
            console.log('Web player has active question - showing completion buttons');
        }
        } else {
        turnElement.textContent = `${webState.partnerName}'s Turn`;
        if (currentPlayerTurn) {
            currentPlayerTurn.classList.remove('pulse-animation');
            currentPlayerTurn.style.background = 'rgba(26, 15, 19, 0.6)';
        }
        
        // Hide action buttons when it's not web player's turn
        hideAllButtons();
        
        // Clear web player's previous question and show waiting message
        questionDisplay.textContent = `Waiting for ${webState.partnerName} to choose...`;
    }
}

/**
 * FIXED: Display question that both players should see
 */
function displaySharedQuestion(questionData) {
    const questionDisplay = document.getElementById('questionDisplay');
    const isForMe = questionData.currentPlayer === 'player2';
    const playerName = isForMe ? 'You' : webState.partnerName;
    
    questionDisplay.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <span class="question-type">${questionData.type.toUpperCase()}</span>
                <span class="question-for">for ${playerName}</span>
            </div>
            <div class="question-text">${questionData.text}</div>
            ${isForMe ? 
                '<p class="turn-prompt">Your turn! Complete this challenge:</p>' :
                `<p class="turn-prompt">Watch ${webState.partnerName} complete this challenge!</p>`
            }
        </div>
    `;
    
    if (isForMe) {
        showCompletionButtons();
    } else {
        hideAllButtons();
    }
    
    // Handle timer if provided
    if (questionData.timer > 0) {
        handleTimer({ duration: questionData.timer });
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
    
    // Force show completion buttons
    const choiceButtons = document.getElementById('choiceButtons');
    const completionButtons = document.getElementById('taskCompletionButtons');
    
    if (choiceButtons) choiceButtons.classList.add('hidden');
    if (completionButtons) {
        completionButtons.classList.remove('hidden');
        completionButtons.style.display = 'flex';
    }
    
    if (questionData.timer > 0) {
        handleTimer({ duration: questionData.timer });
    }
}

/**
 * Handle timer from mobile app
 */
function handleTimer(timerData) {
    const timerContainer = document.getElementById('timerContainer');
    
    if (timerData.duration > 0) {
        timerContainer.classList.remove('hidden');
        timerContainer.innerHTML = `
            <div class="timer-display">
                <i class="fas fa-clock"></i>
                <span id="timerDisplay">00:00</span>
            </div>
            <div class="timer-controls">
                <button id="startTimer" class="timer-btn start"><i class="fas fa-play"></i></button>
                <button id="pauseTimer" class="timer-btn pause"><i class="fas fa-pause"></i></button>
                <button id="resetTimer" class="timer-btn reset"><i class="fas fa-undo"></i></button>
            </div>
        `;
        
        let timeLeft = timerData.duration;
        let timerInterval = null;
        let isRunning = false;
        
        const timerDisplay = document.getElementById('timerDisplay');
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        const resetBtn = document.getElementById('resetTimer');
        
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        startBtn.addEventListener('click', () => {
            if (!isRunning) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        isRunning = false;
                        timerContainer.classList.add('hidden');
                    }
                }, 1000);
            }
        });
        
        pauseBtn.addEventListener('click', () => {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
            }
        });
        
        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = timerData.duration;
            updateDisplay();
        });
        
        updateDisplay();
    } else {
        timerContainer.classList.add('hidden');
    }
}

/**
 * Send response to mobile app
 */
async function sendResponse(responseType) {
    if (!webState.sessionCode) {
        console.error('No session code available');
        return;
    }

    try {
        if (responseType === 'truth' || responseType === 'dare') {
            // Send choice to mobile app
            await FirebaseUtils.sendWebResponse(webState.sessionCode, {
                type: 'choice',
                choice: responseType,
                timestamp: Date.now(),
                playerKey: 'player2'
            });

            // Show waiting message and hide buttons
            document.getElementById('questionDisplay').innerHTML = `
                <div class="waiting-message">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>You chose ${responseType.toUpperCase()}!</p>
                    <p>Generating your question...</p>
                </div>
            `;
            hideAllButtons();
            
            // FIXED: Listen specifically for the question response
            listenForQuestionResponse();
            
        } else if (responseType === 'completed') {
    // Send completion status - switches turn
    await FirebaseUtils.sendWebResponse(webState.sessionCode, {
        type: 'completion',
        completed: true,
        timestamp: Date.now(),
        playerKey: 'player2'
    });

    // Don't update display here - let the game update handle it
    hideAllButtons();
} else if (responseType === 'skipped') {
    // Send skipped status - same player chooses again
    await FirebaseUtils.sendWebResponse(webState.sessionCode, {
        type: 'completion',
        completed: false,
        timestamp: Date.now(),
        playerKey: 'player2'
    });

    document.getElementById('questionDisplay').innerHTML = 'Choose Truth or Dare to continue!';
    showChoiceButtons();
}

    } catch (error) {
        console.error('Error sending response:', error);
        showAlert('Failed to send response. Please try again.');
        
        // Re-enable appropriate buttons on error
        const questionDisplay = document.getElementById('questionDisplay');
        const hasActiveQuestion = questionDisplay.innerHTML.includes('question-content');
        
        if (hasActiveQuestion) {
            showCompletionButtons();
        } else {
            showChoiceButtons();
        }
    }
}

/**
 * Listen for question response after web user makes a choice
 */
function listenForQuestionResponse() {
    const responseRef = firebase.database().ref(`sessions/${webState.sessionCode}/questionResponse`);
    
    responseRef.off();
    
    responseRef.on('value', (snapshot) => {
        const questionData = snapshot.val();
        console.log('Question response received:', questionData);
        
        if (questionData && questionData.forPlayer === 'player2') {
            displayWebQuestion(questionData);
            responseRef.off();
            responseRef.remove();
        }
    });
    
    setTimeout(() => {
        const questionDisplay = document.getElementById('questionDisplay');
        if (questionDisplay.innerHTML.includes('Generating your question')) {
            questionDisplay.textContent = 'No question received. Please try selecting Truth or Dare again.';
            showChoiceButtons();
            responseRef.off();
        }
    }, 10000);
}

/**
 * Show communication options modal
 */
function showCommunicationOptions() {
    const questionDisplay = document.getElementById('questionDisplay');
    questionDisplay.innerHTML = `
        <div class="communication-guide">
            <h3>📱 Share Your Experience!</h3>
            <p>How would you like to respond to your partner?</p>
            
            <div class="communication-options">
                <div class="comm-option" onclick="openWhatsAppCall()">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp Video Call</span>
                </div>
                <div class="comm-option" onclick="openDiscordCall()">
                    <i class="fab fa-discord"></i>
                    <span>Discord Call</span>
                </div>
                <div class="comm-option" onclick="openZoomCall()">
                    <i class="fas fa-video"></i>
                    <span>Zoom Call</span>
                </div>
                <div class="comm-option" onclick="openTelegram()">
                    <i class="fab fa-telegram"></i>
                    <span>Telegram</span>
                </div>
                <div class="comm-option" onclick="continueWithoutCall()">
                    <i class="fas fa-message"></i>
                    <span>Continue Without Call</span>
                </div>
            </div>
            
            <div class="communication-tip">
                <p><strong>💡 Tip:</strong> Video calls make the experience much more intimate and fun! 
                Share your reactions, laugh together, and see each other's expressions.</p>
            </div>
        </div>
    `;
    
    hideAllButtons();
}

/**
 * Communication app openers
 */
function openWhatsAppCall() {
    // Open WhatsApp (if mobile) or WhatsApp Web
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.open('whatsapp://call', '_blank');
    } else {
        window.open('https://web.whatsapp.com/', '_blank');
    }
    
    continueWithoutCall();
}

function openDiscordCall() {
    window.open('discord://', '_blank');
    setTimeout(() => {
        // Fallback to web if app doesn't open
        window.open('https://discord.com/app', '_blank');
    }, 2000);
    
    continueWithoutCall();
}

function openZoomCall() {
    window.open('https://zoom.us/start/videomeeting', '_blank');
    continueWithoutCall();
}

function openTelegram() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.open('tg://', '_blank');
    } else {
        window.open('https://web.telegram.org/', '_blank');
    }
    
    continueWithoutCall();
}

function continueWithoutCall() {
    // Actually send the completion response
    sendCompletionResponse();
}

/**
 * Send the actual completion response
 */
async function sendCompletionResponse() {
    try {
        await FirebaseUtils.sendWebResponse(webState.sessionCode, {
            type: 'completion',
            completed: true, // Assume completed if they got to communication step
            timestamp: Date.now(),
            playerKey: 'player2'
        });

        document.getElementById('questionDisplay').textContent = 'Response sent! Waiting for next turn...';
        hideAllButtons();

    } catch (error) {
        console.error('Error sending response:', error);
        showAlert('Failed to send response. Please try again.');
        showCompletionButtons();
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

// Add these functions to longdistance-web-simple.js

function showChoiceButtons() {
    const choiceButtons = document.getElementById('choiceButtons');
    const completionButtons = document.getElementById('taskCompletionButtons');
    
    if (choiceButtons) {
        choiceButtons.classList.remove('hidden');
        choiceButtons.style.display = 'flex';
    }
    if (completionButtons) {
        completionButtons.classList.add('hidden');
        completionButtons.style.display = 'none';
    }
    
    console.log('Choice buttons shown');
}

function showCompletionButtons() {
    const choiceButtons = document.getElementById('choiceButtons');
    const completionButtons = document.getElementById('taskCompletionButtons');
    
    if (choiceButtons) {
        choiceButtons.classList.add('hidden');
        choiceButtons.style.display = 'none';
    }
    if (completionButtons) {
        completionButtons.classList.remove('hidden');
        completionButtons.style.display = 'flex';
    }
    
    console.log('Completion buttons shown');
}

function hideAllButtons() {
    const choiceButtons = document.getElementById('choiceButtons');
    const completionButtons = document.getElementById('taskCompletionButtons');
    
    if (choiceButtons) {
        choiceButtons.classList.add('hidden');
        choiceButtons.style.display = 'none';
    }
    if (completionButtons) {
        completionButtons.classList.add('hidden');
        completionButtons.style.display = 'none';
    }
    
    console.log('All buttons hidden');
}

function displaySharedQuestion(questionData) {
    const questionDisplay = document.getElementById('questionDisplay');
    const isForMe = questionData.currentPlayer === 'player2';
    const playerName = isForMe ? 'You' : webState.partnerName;
    
    questionDisplay.innerHTML = `
        <div class="question-content">
            <div class="question-header">
                <span class="question-type">${questionData.type.toUpperCase()}</span>
                <span class="question-for">for ${playerName}</span>
            </div>
            <div class="question-text">${questionData.text}</div>
            ${isForMe ? 
                '<p class="turn-prompt">Your turn! Complete this challenge:</p>' :
                `<p class="turn-prompt">Watch ${webState.partnerName} complete this challenge!</p>`
            }
        </div>
    `;
    
    if (isForMe) {
        hideChoiceButtons();
        showCompletionButtons();
    } else {
        hideAllButtons();
    }
    
    // Handle timer if provided
    if (questionData.timer > 0) {
        handleTimer({ duration: questionData.timer });
    }
}

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

// Add to FirebaseUtils
const enhancedFirebaseUtils = {
    ...FirebaseUtils,
    
    async clearQuestionResponse(gameCode) {
        try {
            const responseRef = firebase.database().ref(`sessions/${gameCode}/questionResponse`);
            await responseRef.remove();
        } catch (error) {
            console.error('Error clearing question response:', error);
        }
    },
    
    async sendWebResponse(gameCode, response) {
        try {
            const responseRef = firebase.database().ref(`sessions/${gameCode}/webResponse`);
            await responseRef.set({
                ...response,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            console.log('Web response sent successfully:', response);
        } catch (error) {
            console.error('Error sending web response:', error);
            throw error;
        }
    }
};

// Replace the global FirebaseUtils with enhanced version
window.FirebaseUtils = enhancedFirebaseUtils;

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Make functions globally available
window.openWhatsAppCall = openWhatsAppCall;
window.openDiscordCall = openDiscordCall;
window.openZoomCall = openZoomCall;
window.openTelegram = openTelegram;
window.continueWithoutCall = continueWithoutCall;

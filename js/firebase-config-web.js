/**
 * Firebase Configuration for Long Distance Truth or Dare - Web Version
 */

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe5Yrup_W26xOA6vEQqAFJ3_9-rqNa_0A",
  authDomain: "truth-or-dare-couples-game.firebaseapp.com",
  databaseURL: "https://truth-or-dare-couples-game-default-rtdb.firebaseio.com",
  projectId: "truth-or-dare-couples-game",
  storageBucket: "truth-or-dare-couples-game.firebasestorage.app",
  messagingSenderId: "250807782439",
  appId: "1:250807782439:web:e006bf9a7beab8cdeb1202"
};

// Initialize Firebase
let app;
let database;
let isFirebaseInitialized = false;

function initializeFirebase() {
    try {
        if (!isFirebaseInitialized) {
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK not loaded');
                return false;
            }

            app = firebase.initializeApp(firebaseConfig);
            database = firebase.database();
            isFirebaseInitialized = true;
            console.log('Firebase initialized successfully');
        }
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Firebase utility functions for web version
const FirebaseUtils = {
    // Check if a game code exists and is joinable
    async checkGameCode(gameCode) {
        try {
            if (!database) {
                return { exists: false, error: 'Database not ready' };
            }

            const sessionRef = database.ref(`sessions/${gameCode}`);
            const snapshot = await sessionRef.once('value');
            
            if (!snapshot.exists()) {
                return { exists: false };
            }

            const sessionData = snapshot.val();
            
            return {
                exists: true,
                status: sessionData.status,
                joinable: sessionData.status === 'waiting',
                hostName: sessionData.players?.player1?.name || 'Unknown',
                sessionData: sessionData
            };
        } catch (error) {
            console.error('Error checking game code:', error);
            return { exists: false, error: error.message };
        }
    },

    // Join an existing game session (web version)
    async joinGameSession(gameCode, playerData) {
        try {
            const sessionRef = database.ref(`sessions/${gameCode}`);
            const snapshot = await sessionRef.once('value');
            
            if (!snapshot.exists()) {
                throw new Error('Game session not found');
            }

            const sessionData = snapshot.val();
            if (sessionData.status !== 'waiting') {
                throw new Error('Game session is not available for joining');
            }

            // Add player 2 to the session
            await sessionRef.child('players/player2').set({
                name: playerData.playerName,
                isHost: false,
                connected: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP,
                platform: 'web' // Mark as web player
            });

            // Update session status to active
            await sessionRef.child('status').set('active');
            await sessionRef.child('lastActivity').set(firebase.database.ServerValue.TIMESTAMP);

            return sessionData;
        } catch (error) {
            console.error('Error joining game session:', error);
            throw error;
        }
    },

    // Update player's online status
    async updatePlayerStatus(gameCode, playerKey, isOnline) {
        try {
            const playerRef = database.ref(`sessions/${gameCode}/players/${playerKey}`);
            await playerRef.update({
                connected: isOnline,
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (error) {
            console.error('Error updating player status:', error);
        }
    },

    // Update game state
    async updateGameState(gameCode, gameState) {
        try {
            const gameStateRef = database.ref(`sessions/${gameCode}/gameState`);
            await gameStateRef.update({
                ...gameState,
                lastUpdated: firebase.database.ServerValue.TIMESTAMP
            });
            
            // Update session last activity
            await database.ref(`sessions/${gameCode}/lastActivity`)
                .set(firebase.database.ServerValue.TIMESTAMP);
        } catch (error) {
            console.error('Error updating game state:', error);
            throw error;
        }
    },

    // Listen for game state changes
    listenToGameState(gameCode, callback) {
        const sessionRef = database.ref(`sessions/${gameCode}`);
        sessionRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            } else {
                callback(null);
            }
        });
        return sessionRef;
    },

    // Listen for player status changes
    listenToPlayerStatus(gameCode, callback) {
        const playersRef = database.ref(`sessions/${gameCode}/players`);
        playersRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        });
        return playersRef;
    },

    // Set up presence detection for web
    setupPresence(gameCode, playerKey) {
        const presenceRef = database.ref(`sessions/${gameCode}/players/${playerKey}/connected`);
        const connectedRef = database.ref('.info/connected');
        
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                presenceRef.onDisconnect().set(false);
                presenceRef.set(true);
            }
        });
        
        return { presenceRef, connectedRef };
    },

    // Clean up session
    cleanupSession(gameCode, playerKey) {
        try {
            database.ref(`sessions/${gameCode}`).off();
            
            if (playerKey) {
                this.updatePlayerStatus(gameCode, playerKey, false);
            }
        } catch (error) {
            console.error('Error cleaning up session:', error);
        }
    },

    // End game session
    async endGameSession(gameCode, results) {
        try {
            const sessionRef = database.ref(`sessions/${gameCode}`);
            await sessionRef.update({
                status: 'completed',
                endTime: firebase.database.ServerValue.TIMESTAMP,
                results: results
            });
        } catch (error) {
            console.error('Error ending game session:', error);
        }
    },

    // Send web user response to mobile app
    async sendWebResponse(gameCode, response) {
        try {
            const responseRef = database.ref(`sessions/${gameCode}/webResponse`);
            await responseRef.set({
                ...response,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (error) {
            console.error('Error sending web response:', error);
            throw error;
        }
    },

    // Clear web response after processing
    async clearWebResponse(gameCode) {
        try {
            const responseRef = database.ref(`sessions/${gameCode}/webResponse`);
            await responseRef.remove();
        } catch (error) {
            console.error('Error clearing web response:', error);
        }
    }
};

// Connection test for web
function testFirebaseConnection() {
    return new Promise((resolve) => {
        if (!database) {
            resolve(false);
            return;
        }

        const testRef = database.ref('.info/connected');
        const timeout = setTimeout(() => {
            resolve(false);
        }, 3000);

        testRef.once('value', (snapshot) => {
            clearTimeout(timeout);
            resolve(snapshot.val());
        }).catch(() => {
            clearTimeout(timeout);
            resolve(false);
        });
    });
}

// Initialize Firebase when the script loads
document.addEventListener('DOMContentLoaded', function() {
    const success = initializeFirebase();
    
    if (success) {
        testFirebaseConnection()
            .then(connected => {
                console.log('Firebase connection status:', connected);
            })
            .catch(error => {
                console.error('Firebase connection test failed:', error);
            });
    }
});

// Make utilities available globally
window.FirebaseUtils = FirebaseUtils;
window.initializeFirebase = initializeFirebase;
window.testFirebaseConnection = testFirebaseConnection;

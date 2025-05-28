/**
 * Couples Intimacy Profile Assessment
 * Handles the assessment functionality and gauge visualization
 */

// Assessment state
const assessmentState = {
    eroticQuestions: {},
    romanticQuestions: {},
    profileCategories: {},
    compatibilityMatrix: [],
    establishedProfileCategories: {},
    establishedCompatibilityMatrix: [],
    eroticTasks: [],
    romanticTasks: [],
    selectedEroticTasks: [],
    selectedRomanticTasks: [],
    eroticScore: 0,
    romanticScore: 0,
    profileName: '',
    eroticLevel: '',
    romanticLevel: '',
    profileSummary: '',
    relationshipDuration: 'new'
};

// Age verification modal
function showAgeModal() {
    const modal = document.createElement('div');
    modal.className = 'age-modal';
    modal.innerHTML = `
        <div class="age-modal-content">
            <h2><i class="fas fa-exclamation-triangle"></i> Age Verification</h2>
            <p>This content is designed for adults only. You must be 18 years or older to continue.</p>
            <p>By clicking 'Yes', you confirm that you are at least 18 years of age and consent to viewing adult content.</p>
            <p>Are you 18 years of age or older?</p>
            <div class="age-buttons">
                <button class="age-button yes" onclick="confirmAge(true)">
                    <i class="fas fa-check"></i> Yes, I am 18+
                </button>
                <button class="age-button no" onclick="confirmAge(false)">
                    <i class="fas fa-times"></i> No, I am under 18
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmAge(isAdult) {
    const modal = document.querySelector('.age-modal');
    if (modal) {
        modal.remove();
    }
    
    if (isAdult) {
        // Continue with the assessment
        localStorage.setItem('ageVerified', 'true');
        initAssessment();
    } else {
        // Redirect back to main page
        window.location.href = 'index.html';
    }
}

// Wait for window to load completely before initializing
window.onload = function() {
    // Check age verification first
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
        showAgeModal();
        return;
    }
    
    // DEBUG: Check global variables availability
    console.log("DEBUG: Checking globals at window.onload:");
    console.log("eroticQuestions available:", typeof eroticQuestions);
    console.log("romanticQuestions available:", typeof romanticQuestions);
    console.log("profileCategories available:", typeof profileCategories);
    console.log("compatibilityMatrix available:", typeof compatibilityMatrix);
    console.log("establishedCompatibilityMatrix available:", typeof establishedCompatibilityMatrix);
    
    initAssessment();
};

function initAssessment() {
    try {
        console.log('Initializing assessment...');
        
        // Add animations and show preview gauges with defaults
        initializePreviewGauges();
        
        // First try to import the assessment questions
        importAssessmentQuestions();
        
        // Set up event listeners
        setupAssessmentEventListeners();
        
        // Load saved assessment if exists
        loadSavedAssessment();
        
        console.log('Assessment initialized');
    } catch (error) {
        console.error('Error initializing assessment:', error);
        showErrorMessage('There was an error initializing the assessment. Please try refreshing the page.');
    }
}

// Initialize preview gauges with default values
function initializePreviewGauges() {
    console.log('Initializing preview gauges');
    
    const eroticPercentagePreview = document.getElementById('eroticPercentagePreview');
    const romanticPercentagePreview = document.getElementById('romanticPercentagePreview');
    const eroticLevelPreview = document.getElementById('eroticLevelPreview');
    const romanticLevelPreview = document.getElementById('romanticLevelPreview');
    
    // Set default percentage values
    if (eroticPercentagePreview) eroticPercentagePreview.textContent = '0%';
    if (romanticPercentagePreview) romanticPercentagePreview.textContent = '0%';
    
    // Set default level texts
    if (eroticLevelPreview) eroticLevelPreview.textContent = 'Current Level: Novice';
    if (romanticLevelPreview) romanticLevelPreview.textContent = 'Current Level: Casual';
}

// Import the assessment questions from external file or use defaults
function importAssessmentQuestions() {
    console.log('Importing assessment questions...');
    
    try {
        // Check if the globals from assessment-questions.js are available
        if (typeof eroticQuestions !== 'undefined' && 
            typeof romanticQuestions !== 'undefined' &&
            typeof profileCategories !== 'undefined' &&
            typeof compatibilityMatrix !== 'undefined') {

            // Copy the imported data into our assessmentState
            assessmentState.eroticQuestions = eroticQuestions;
            assessmentState.romanticQuestions = romanticQuestions;
            assessmentState.profileCategories = profileCategories;
            assessmentState.compatibilityMatrix = compatibilityMatrix;

            // Also import established relationship data if available
            if (typeof establishedProfileCategories !== 'undefined') {
                assessmentState.establishedProfileCategories = establishedProfileCategories;
            }

            if (typeof establishedCompatibilityMatrix !== 'undefined') {
                assessmentState.establishedCompatibilityMatrix = establishedCompatibilityMatrix;
            }
            
            console.log('Successfully imported assessment questions');
            
            // Check soft property as a sanity check
            if (assessmentState.eroticQuestions.soft) {
                console.log("Soft questions found:", assessmentState.eroticQuestions.soft.length);
            } else {
                console.warn("Soft questions not found in eroticQuestions");
            }
            
            // Convert questions to tasks format
            convertQuestionsToTasks();
        } else {
            console.warn('Assessment questions not found in global scope, using defaults');
            console.warn('Available globals:', Object.keys(window).filter(k => k.includes('question') || k.includes('profile') || k.includes('matrix')));
            createDefaultTasks();
        }
    } catch (error) {
        console.error("Error importing questions:", error);
        createDefaultTasks(); // Fallback to defaults
    }
}

// Convert imported questions to task format
function convertQuestionsToTasks() {
    console.log('Converting questions to tasks format');
    
    try {
        // Convert erotic questions
        let eroticTasks = [];
        let eroticIndex = 0;
        
        if (assessmentState.eroticQuestions.soft) {
            assessmentState.eroticQuestions.soft.forEach(text => {
                eroticTasks.push({
                    id: 'erotic_' + eroticIndex++,
                    text: text,
                    level: 'Soft',
                    value: 1
                });
            });
            console.log("Added", assessmentState.eroticQuestions.soft.length, "soft erotic tasks");
        }
        
        if (assessmentState.eroticQuestions.sensual) {
            assessmentState.eroticQuestions.sensual.forEach(text => {
                eroticTasks.push({
                    id: 'erotic_' + eroticIndex++,
                    text: text,
                    level: 'Sensual',
                    value: 2
                });
            });
            console.log("Added", assessmentState.eroticQuestions.sensual.length, "sensual erotic tasks");
        }
        
        if (assessmentState.eroticQuestions.hot) {
            assessmentState.eroticQuestions.hot.forEach(text => {
                eroticTasks.push({
                    id: 'erotic_' + eroticIndex++,
                    text: text,
                    level: 'Hot',
                    value: 3
                });
            });
            console.log("Added", assessmentState.eroticQuestions.hot.length, "hot erotic tasks");
        }
        
        if (assessmentState.eroticQuestions.extreme) {
            assessmentState.eroticQuestions.extreme.forEach(text => {
                eroticTasks.push({
                    id: 'erotic_' + eroticIndex++,
                    text: text,
                    level: 'Extreme',
                    value: 4
                });
            });
            console.log("Added", assessmentState.eroticQuestions.extreme.length, "extreme erotic tasks");
        }
        
        // Convert romantic questions
        let romanticTasks = [];
        let romanticIndex = 0;
        
        if (assessmentState.romanticQuestions.casual) {
            assessmentState.romanticQuestions.casual.forEach(text => {
                romanticTasks.push({
                    id: 'romantic_' + romanticIndex++,
                    text: text,
                    level: 'Casual',
                    value: 1
                });
            });
            console.log("Added", assessmentState.romanticQuestions.casual.length, "casual romantic tasks");
        }
        
        if (assessmentState.romanticQuestions.affectionate) {
            assessmentState.romanticQuestions.affectionate.forEach(text => {
                romanticTasks.push({
                    id: 'romantic_' + romanticIndex++,
                    text: text,
                    level: 'Affectionate',
                    value: 2
                });
            });
            console.log("Added", assessmentState.romanticQuestions.affectionate.length, "affectionate romantic tasks");
        }
        
        if (assessmentState.romanticQuestions.devoted) {
            assessmentState.romanticQuestions.devoted.forEach(text => {
                romanticTasks.push({
                    id: 'romantic_' + romanticIndex++,
                    text: text,
                    level: 'Devoted',
                    value: 3
                });
            });
            console.log("Added", assessmentState.romanticQuestions.devoted.length, "devoted romantic tasks");
        }
        
        if (assessmentState.romanticQuestions.passionate) {
            assessmentState.romanticQuestions.passionate.forEach(text => {
                romanticTasks.push({
                    id: 'romantic_' + romanticIndex++,
                    text: text,
                    level: 'Passionate',
                    value: 4
                });
            });
            console.log("Added", assessmentState.romanticQuestions.passionate.length, "passionate romantic tasks");
        }
        
        // Set tasks in assessment state
        assessmentState.eroticTasks = eroticTasks;
        assessmentState.romanticTasks = romanticTasks;
        
        console.log(`Created ${assessmentState.eroticTasks.length} erotic tasks and ${assessmentState.romanticTasks.length} romantic tasks`);
        
        // Render the tasks
        renderTasks();
    } catch (error) {
        console.error('Error converting questions to tasks:', error);
        console.error('Error details:', error.message, error.stack);
        createDefaultTasks(); // Fallback to defaults
    }
}

// Create default assessment tasks if none are found
function createDefaultTasks() {
    console.log('Creating default assessment tasks');
    
    // Default erotic tasks
    assessmentState.eroticTasks = [
        { id: 'erotic_1', text: 'We have held hands in public', level: 'Soft', value: 1 },
        { id: 'erotic_2', text: 'We have cuddled while watching a movie', level: 'Soft', value: 1 },
        { id: 'erotic_3', text: 'We have given each other massage (non-sexual)', level: 'Soft', value: 1 }
    ];
    
    // Default romantic tasks
    assessmentState.romanticTasks = [
        { id: 'romantic_1', text: 'We text or call each other regularly throughout the day', level: 'Casual', value: 1 },
        { id: 'romantic_2', text: 'We have favorite TV shows that we watch together', level: 'Casual', value: 1 },
        { id: 'romantic_3', text: 'We have inside jokes that only we understand', level: 'Casual', value: 1 }
    ];
    
    console.log(`Created ${assessmentState.eroticTasks.length} default erotic tasks and ${assessmentState.romanticTasks.length} default romantic tasks`);
    
    // Render the tasks
    renderTasks();
}

// Render tasks to the DOM
function renderTasks() {
    console.log('Rendering tasks to DOM');
    console.log('Erotic tasks count:', assessmentState.eroticTasks.length);
    console.log('Romantic tasks count:', assessmentState.romanticTasks.length);
    
    try {
        // Re-get DOM elements to ensure we have them
        const eroticTasksList = document.getElementById('eroticTasks');
        const romanticTasksList = document.getElementById('romanticTasks');
        
        console.log("DOM elements before rendering:");
        console.log("eroticTasksList exists:", !!eroticTasksList);
        console.log("romanticTasksList exists:", !!romanticTasksList);
        
        // Clear loading messages and existing tasks
        if (eroticTasksList) {
            eroticTasksList.innerHTML = assessmentState.eroticTasks.length > 0 ? '' : '<p class="loading-message">No erotic tasks found.</p>';
        } else {
            console.error("Cannot clear eroticTasksList - element not found");
            return;
        }
        
        if (romanticTasksList) {
            romanticTasksList.innerHTML = assessmentState.romanticTasks.length > 0 ? '' : '<p class="loading-message">No romantic tasks found.</p>';
        } else {
            console.error("Cannot clear romanticTasksList - element not found");
            return;
        }
        
        // Render erotic tasks
        if (eroticTasksList && assessmentState.eroticTasks.length > 0) {
            console.log("Adding erotic tasks to DOM...");
            assessmentState.eroticTasks.forEach((task, i) => {
                if (i < 3) console.log(`Task ${i}:`, task.text.substring(0, 30) + "...");
                
                try {
                    const taskElement = createTaskElement(task, 'erotic');
                    eroticTasksList.appendChild(taskElement);
                } catch (error) {
                    console.error("Error creating/appending erotic task:", error);
                }
            });
            console.log("Done adding erotic tasks");
        }
        
        // Render romantic tasks
        if (romanticTasksList && assessmentState.romanticTasks.length > 0) {
            console.log("Adding romantic tasks to DOM...");
            assessmentState.romanticTasks.forEach((task, i) => {
                if (i < 3) console.log(`Task ${i}:`, task.text.substring(0, 30) + "...");
                
                try {
                    const taskElement = createTaskElement(task, 'romantic');
                    romanticTasksList.appendChild(taskElement);
                } catch (error) {
                    console.error("Error creating/appending romantic task:", error);
                }
            });
            console.log("Done adding romantic tasks");
        }
        
        console.log('Task rendering complete');
    } catch (error) {
        console.error("Error in renderTasks:", error);
        showErrorMessage('There was an error rendering the tasks. Please try refreshing the page.');
    }
}

// Create a task element
function createTaskElement(task, type) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.dataset.id = task.id;
    taskElement.dataset.level = task.level;
    taskElement.dataset.value = task.value;
    
    // Check if task is selected
    const isSelected = type === 'erotic' 
        ? assessmentState.selectedEroticTasks.includes(task.id)
        : assessmentState.selectedRomanticTasks.includes(task.id);
    
    if (isSelected) {
        taskElement.classList.add('selected');
    }
    
    taskElement.innerHTML = `
        <div class="task-checkbox">
            <i class="fas ${isSelected ? 'fa-check-square' : 'fa-square'}"></i>
        </div>
        <div class="task-text">${task.text}</div>
        <div class="task-level ${task.level.toLowerCase()}">${task.level}</div>
    `;
    
    // Add click event to toggle selection
    taskElement.addEventListener('click', function() {
        toggleTaskSelection(task.id, type);
        
        // Toggle visual state
        this.classList.toggle('selected');
        const checkbox = this.querySelector('.task-checkbox i');
        if (checkbox) {
            checkbox.className = this.classList.contains('selected') 
                ? 'fas fa-check-square' 
                : 'fas fa-square';
        }
        
        // Update preview gauges when tasks are toggled
        updatePreviewGauges();
    });
    
    return taskElement;
}

// Toggle task selection in state
function toggleTaskSelection(taskId, type) {
    if (type === 'erotic') {
        // Toggle erotic task selection
        if (assessmentState.selectedEroticTasks.includes(taskId)) {
            assessmentState.selectedEroticTasks = assessmentState.selectedEroticTasks.filter(id => id !== taskId);
        } else {
            assessmentState.selectedEroticTasks.push(taskId);
        }
    } else {
        // Toggle romantic task selection
        if (assessmentState.selectedRomanticTasks.includes(taskId)) {
            assessmentState.selectedRomanticTasks = assessmentState.selectedRomanticTasks.filter(id => id !== taskId);
        } else {
            assessmentState.selectedRomanticTasks.push(taskId);
        }
    }
    
    // Save the current state to localStorage
    saveAssessmentState();
}

// Set relationship duration
function setRelationshipDuration(duration) {
    assessmentState.relationshipDuration = duration;
    
    // Update UI
    const newRelationshipButton = document.getElementById('newRelationship');
    const establishedRelationshipButton = document.getElementById('establishedRelationship');
    
    if (newRelationshipButton && establishedRelationshipButton) {
        newRelationshipButton.classList.toggle('active', duration === 'new');
        establishedRelationshipButton.classList.toggle('active', duration === 'established');
    }
    
    // Save to localStorage
    saveAssessmentState();
    
    console.log(`Relationship duration set to: ${duration}`);
}

// Update preview gauges based on current selections
function updatePreviewGauges() {
    // Calculate current scores
    calculateScores();
    
    // Update preview percentages
    const eroticPercentagePreview = document.getElementById('eroticPercentagePreview');
    const romanticPercentagePreview = document.getElementById('romanticPercentagePreview');
    
    if (eroticPercentagePreview) eroticPercentagePreview.textContent = `${assessmentState.eroticScore}%`;
    if (romanticPercentagePreview) romanticPercentagePreview.textContent = `${assessmentState.romanticScore}%`;
    
    // Update preview levels
    const eroticLevelName = getEroticLevel(assessmentState.eroticScore);
    const romanticLevelName = getRomanticLevel(assessmentState.romanticScore);
    
    const eroticLevelPreview = document.getElementById('eroticLevelPreview');
    const romanticLevelPreview = document.getElementById('romanticLevelPreview');
    
    if (eroticLevelPreview) eroticLevelPreview.textContent = `Current Level: ${eroticLevelName}`;
    if (romanticLevelPreview) romanticLevelPreview.textContent = `Current Level: ${romanticLevelName}`;
    
    // Update needle positions
    const eroticAngle = -90 + (assessmentState.eroticScore / 100 * 180);
    const romanticAngle = -90 + (assessmentState.romanticScore / 100 * 180);
    
    const eroticGaugePreview = document.getElementById('eroticGaugePreview');
    const romanticGaugePreview = document.getElementById('romanticGaugePreview');
    
    const eroticNeedle = eroticGaugePreview?.querySelector('.gauge-needle');
    if (eroticNeedle) {
        eroticNeedle.style.transform = `rotate(${eroticAngle}deg)`;
    }
    
    const romanticNeedle = romanticGaugePreview?.querySelector('.gauge-needle');
    if (romanticNeedle) {
        romanticNeedle.style.transform = `rotate(${romanticAngle}deg)`;
    }
}

// Save assessment state to localStorage
function saveAssessmentState() {
    const state = {
        selectedEroticTasks: assessmentState.selectedEroticTasks,
        selectedRomanticTasks: assessmentState.selectedRomanticTasks,
        relationshipDuration: assessmentState.relationshipDuration,
        // Save previous scores and date
        previousEroticScore: assessmentState.eroticScore || 0,
        previousRomanticScore: assessmentState.romanticScore || 0,
        previousEroticLevel: assessmentState.eroticLevel || '',
        previousRomanticLevel: assessmentState.romanticLevel || '',
        assessmentDate: new Date().toISOString()
    };
    
    localStorage.setItem('couplesAssessmentState', JSON.stringify(state));
    console.log('Assessment state saved');
}

// Load saved assessment from localStorage
function loadSavedAssessment() {
    console.log('Loading saved assessment state');
    try {
        const savedState = localStorage.getItem('couplesAssessmentState');
        if (savedState) {
            const state = JSON.parse(savedState);
            assessmentState.selectedEroticTasks = state.selectedEroticTasks || [];
            assessmentState.selectedRomanticTasks = state.selectedRomanticTasks || [];
            assessmentState.relationshipDuration = state.relationshipDuration || 'new';
            
            // Load previous scores and date
            assessmentState.previousEroticScore = state.previousEroticScore || 0;
            assessmentState.previousRomanticScore = state.previousRomanticScore || 0;
            assessmentState.previousEroticLevel = state.previousEroticLevel || '';
            assessmentState.previousRomanticLevel = state.previousRomanticLevel || '';
            assessmentState.previousAssessmentDate = state.assessmentDate || '';
            
            // Update the UI for duration buttons
            setRelationshipDuration(assessmentState.relationshipDuration);
            
            console.log('Loaded saved assessment state');
            
            // Rerender tasks to reflect loaded state
            renderTasks();
            
            // Update preview gauges
            updatePreviewGauges();
        }
    } catch (e) {
        console.error('Error loading saved assessment:', e);
    }
}

// Set up event listeners
function setupAssessmentEventListeners() {
    console.log('Setting up event listeners');
    
    // Re-get elements to be sure
    const sectionToggles = document.querySelectorAll('.section-toggle');
    const submitAssessmentButton = document.getElementById('submitAssessmentButton');
    const resetAssessmentButton = document.getElementById('resetAssessmentButton');
    const retakeAssessmentButton = document.getElementById('retakeAssessmentButton');
    const newRelationshipButton = document.getElementById('newRelationship');
    const establishedRelationshipButton = document.getElementById('establishedRelationship');
    
    // Section toggle buttons
    sectionToggles.forEach(toggle => {
        console.log('Setting up listener for toggle:', toggle.getAttribute('data-section'));
        toggle.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default behavior
            const section = this.getAttribute('data-section');
            console.log('Toggle clicked:', section);
            toggleSection(section);
        });
    });
    
    // Submit assessment button
    if (submitAssessmentButton) {
        submitAssessmentButton.addEventListener('click', submitAssessment);
    } else {
        console.error("Submit assessment button not found!");
    }
    
    // Reset assessment button
    if (resetAssessmentButton) {
        resetAssessmentButton.addEventListener('click', resetAssessment);
    } else {
        console.error("Reset assessment button not found!");
    }
    
    // Retake assessment button
    if (retakeAssessmentButton) {
        retakeAssessmentButton.addEventListener('click', retakeAssessment);
    } else {
        console.log("Retake assessment button not found - likely on results screen");
    }
    
    // Duration selection buttons
    if (newRelationshipButton && establishedRelationshipButton) {
        newRelationshipButton.addEventListener('click', function() {
            setRelationshipDuration('new');
        });
        
        establishedRelationshipButton.addEventListener('click', function() {
            setRelationshipDuration('established');
        });
    } else {
        console.log("Relationship duration buttons not found - check your HTML");
    }
}

// Toggle between assessment sections
function toggleSection(sectionId) {
    console.log("Toggling section:", sectionId);
    
    // Re-get section elements
    const sectionToggles = document.querySelectorAll('.section-toggle');
    const assessmentSections = document.querySelectorAll('.assessment-section');
    
    // Update toggle buttons
    sectionToggles.forEach(toggle => {
        const toggleSection = toggle.getAttribute('data-section');
        toggle.classList.remove('active');
        if (toggleSection === sectionId) {
            toggle.classList.add('active');
        }
    });
    
    // Update sections
    assessmentSections.forEach(section => {
        const sectionExpectedId = sectionId + 'Section';
        section.classList.remove('active');
        if (section.id === sectionExpectedId) {
            section.classList.add('active');
            console.log(`Made section ${section.id} active`);
        }
    });
    
    console.log("Section toggle complete");
}

// Submit the assessment
function submitAssessment() {
    console.log('Submitting assessment');
    
    // Calculate scores
    calculateScores();
    
    // Generate profile name
    generateProfileName();
    
    // First store original scroll position
    const originalScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show the results screen
    showScreen(document.getElementById('resultsScreen'));
    
    // Force scroll to top immediately using multiple methods
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.location.hash = '';
    window.location.hash = 'top-anchor';
    
    // Force additional scroll attempts with delays
    setTimeout(() => {
        console.log("First scroll attempt");
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 50);
    
    setTimeout(() => {
        console.log("Second scroll attempt");
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 150);
    
    setTimeout(() => {
        console.log("Third scroll attempt");
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
        
        // Try scrolling all scrollable elements 
        document.querySelectorAll('.screen.active, body, html, .container').forEach(el => {
            if (el) el.scrollTop = 0;
        });
    }, 300);
    
    // Animate the gauges
    animateGauges();
}

// Calculate scores based on selected tasks
function calculateScores() {
    // Use a reduced denominator for easier progression
    const eroticTotalPossible = assessmentState.eroticTasks.reduce((sum, task) => sum + parseInt(task.value || 1), 0) * 0.65; // Only need 65% of total to reach max
    const eroticSelected = assessmentState.eroticTasks
        .filter(task => assessmentState.selectedEroticTasks.includes(task.id))
        .reduce((sum, task) => sum + parseInt(task.value || 1), 0);
    
    // Add diversity bonus
    const eroticCategories = new Set(assessmentState.eroticTasks
        .filter(task => assessmentState.selectedEroticTasks.includes(task.id))
        .map(task => task.level));
    const diversityBonus = Math.min(25, eroticCategories.size * 7); // Up to 28% bonus for selecting from all 4 categories
    
    // Calculate final score with both adjustments
    assessmentState.eroticScore = Math.min(100, Math.round((eroticSelected / Math.max(eroticTotalPossible, 1)) * 100) + diversityBonus);
    
    // Same approach for romantic score
    const romanticTotalPossible = assessmentState.romanticTasks.reduce((sum, task) => sum + parseInt(task.value || 1), 0) * 0.65;
    const romanticSelected = assessmentState.romanticTasks
        .filter(task => assessmentState.selectedRomanticTasks.includes(task.id))
        .reduce((sum, task) => sum + parseInt(task.value || 1), 0);
    
    const romanticCategories = new Set(assessmentState.romanticTasks
        .filter(task => assessmentState.selectedRomanticTasks.includes(task.id))
        .map(task => task.level));
    const romanticDiversityBonus = Math.min(25, romanticCategories.size * 7);
    
    assessmentState.romanticScore = Math.min(100, Math.round((romanticSelected / Math.max(romanticTotalPossible, 1)) * 100) + romanticDiversityBonus);
    
    console.log(`Scores calculated - Erotic: ${assessmentState.eroticScore}%, Romantic: ${assessmentState.romanticScore}%`);
    
    // Set the level names
    assessmentState.eroticLevel = getEroticLevelKey(assessmentState.eroticScore);
    assessmentState.romanticLevel = getRomanticLevelKey(assessmentState.romanticScore);
}

// Get profile categories based on relationship duration
function getProfileCategories() {
    return assessmentState.relationshipDuration === 'established' && 
           assessmentState.establishedProfileCategories && 
           Object.keys(assessmentState.establishedProfileCategories).length > 0 
           ? assessmentState.establishedProfileCategories 
           : assessmentState.profileCategories;
}

// Generate a profile name based on scores
function generateProfileName() {
    const profileNameElement = document.getElementById('profileName');
    const profileDescription = document.getElementById('profileDescription');
    const eroticLevel = document.getElementById('eroticLevel');
    const romanticLevel = document.getElementById('romanticLevel');
    const transitionMessage = document.getElementById('transitionMessage');
    
    // Get level keys based on percentages
    const eroticLevelKey = assessmentState.eroticLevel; 
    const romanticLevelKey = assessmentState.romanticLevel;
    
    console.log(`Levels: Erotic=${eroticLevelKey}, Romantic=${romanticLevelKey}`);
    
    // Generate transition message if this isn't the first assessment
    const transition = generateTransitionMessage();
    if (transition && transitionMessage) {
        transitionMessage.textContent = transition;
        transitionMessage.style.display = 'block';
    } else if (transitionMessage) {
        transitionMessage.style.display = 'none';
    }
    
    // Update previous results section if available
    updatePreviousResults();
    
    // Get profile information from categories based on relationship duration
    const categories = getProfileCategories();
    
    if (categories && 
        categories.erotic && 
        categories.erotic[eroticLevelKey] &&
        categories.romantic && 
        categories.romantic[romanticLevelKey]) {
        
        const eroticProfile = categories.erotic[eroticLevelKey];
        const romanticProfile = categories.romantic[romanticLevelKey];
        
        // Set the full profile name (combination of both titles)
        assessmentState.profileName = `${romanticProfile.title} & ${eroticProfile.title}`;
        
        // Update UI elements with data from profile categories
        if (profileNameElement) profileNameElement.textContent = assessmentState.profileName;
        
        // Look up the compatibility description from the matrix
        let compatDescription = findCompatibilityDescription(eroticLevelKey, romanticLevelKey);
        
        if (profileDescription && compatDescription) {
            profileDescription.textContent = compatDescription;
        } else if (profileDescription) {
            // Fallback to a combination of both descriptions
            profileDescription.textContent = `${romanticProfile.description} ${eroticProfile.description}`;
        }
    } else {
        // Fallback to simple names if profile categories not available
        const eroticLevelName = getEroticLevel(assessmentState.eroticScore);
        const romanticLevelName = getRomanticLevel(assessmentState.romanticScore);
        
        // Set the profile name
        assessmentState.profileName = `${romanticLevelName} ${eroticLevelName} Lovers`;
        
        // Update UI elements
        if (profileNameElement) profileNameElement.textContent = assessmentState.profileName;
        if (profileDescription) profileDescription.textContent = getProfileDescription(romanticLevelName, eroticLevelName);
    }
    
    // Update level displays
    if (eroticLevel) {
        eroticLevel.textContent = `Level: ${getEroticLevel(assessmentState.eroticScore)}`;
    }
    
    if (romanticLevel) {
        romanticLevel.textContent = `Level: ${getRomanticLevel(assessmentState.romanticScore)}`;
    }
    
    // Update balance description
    updateBalanceDescription();
}

// Update previous results section
function updatePreviousResults() {
    const previousResultsSection = document.getElementById('previousResultsSection');
    if (!previousResultsSection) return;
    
    const previousDate = document.getElementById('previousDate');
    const previousEroticScore = document.getElementById('previousEroticScore');
    const previousRomanticScore = document.getElementById('previousRomanticScore');
    const currentEroticScore = document.getElementById('currentEroticScore');
    const currentRomanticScore = document.getElementById('currentRomanticScore');
    const eroticArrow = document.getElementById('eroticArrow');
    const romanticArrow = document.getElementById('romanticArrow');
    
    // Check if we have previous results
    if (assessmentState.previousAssessmentDate && 
        assessmentState.previousEroticScore && 
        assessmentState.previousRomanticScore) {
        
        // Format date
        let dateObj = new Date(assessmentState.previousAssessmentDate);
        let formattedDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Update the DOM
        if (previousDate) previousDate.textContent = formattedDate;
        if (previousEroticScore) previousEroticScore.textContent = `${assessmentState.previousEroticScore}%`;
        if (previousRomanticScore) previousRomanticScore.textContent = `${assessmentState.previousRomanticScore}%`;
        if (currentEroticScore) currentEroticScore.textContent = `${assessmentState.eroticScore}%`;
        if (currentRomanticScore) currentRomanticScore.textContent = `${assessmentState.romanticScore}%`;
        
        // Set arrows
        if (eroticArrow) {
            if (assessmentState.eroticScore > assessmentState.previousEroticScore) {
                eroticArrow.textContent = '↑';
                eroticArrow.className = 'arrow-up';
            } else if (assessmentState.eroticScore < assessmentState.previousEroticScore) {
                eroticArrow.textContent = '↓';
                eroticArrow.className = 'arrow-down';
            } else {
                eroticArrow.textContent = '→';
                eroticArrow.className = 'arrow-same';
            }
        }
        
        if (romanticArrow) {
            if (assessmentState.romanticScore > assessmentState.previousRomanticScore) {
                romanticArrow.textContent = '↑';
                romanticArrow.className = 'arrow-up';
            } else if (assessmentState.romanticScore < assessmentState.previousRomanticScore) {
                romanticArrow.textContent = '↓';
                romanticArrow.className = 'arrow-down';
            } else {
                romanticArrow.textContent = '→';
                romanticArrow.className = 'arrow-same';
            }
        }
        
        // Show the section
        previousResultsSection.style.display = 'block';
    } else {
        // Hide the section if no previous results
        previousResultsSection.style.display = 'none';
    }
}

// Generate transition messages when profile levels change
function generateTransitionMessage() {
    if (!assessmentState.previousEroticLevel || !assessmentState.previousRomanticLevel) {
        return null; // No previous assessment
    }
    
    const eroticChanged = assessmentState.eroticLevel !== assessmentState.previousEroticLevel;
    const romanticChanged = assessmentState.romanticLevel !== assessmentState.previousRomanticLevel;
    
    if (!eroticChanged && !romanticChanged) {
        return null; // No changes in levels
    }
    
    let message = '';
    
    // Erotic transitions
    if (eroticChanged) {
        const improved = assessmentState.eroticScore > assessmentState.previousEroticScore;
        
        if (improved) {
            if (assessmentState.previousEroticLevel === 'novice' && assessmentState.eroticLevel === 'curious') {
                message += "Your physical connection is blossoming! Since your last assessment, you've begun stepping beyond your comfort zone. ";
            } else if (assessmentState.previousEroticLevel === 'curious' && assessmentState.eroticLevel === 'adventurous') {
                message += "Your intimate connection has evolved beautifully! You've moved from curious exploration to confident adventure. ";
            } else if (assessmentState.previousEroticLevel === 'adventurous' && assessmentState.eroticLevel === 'daring') {
                message += "Your physical relationship has reached new heights! Your adventures together have built extraordinary trust. ";
            } else if (assessmentState.previousEroticLevel === 'daring' && assessmentState.eroticLevel === 'Fiery') {
                message += "Your intimate connection has transformed into something truly exceptional! ";
            } else {
                message += "Your physical connection has strengthened since your last assessment. ";
            }
        }
    }
    
    // Romantic transitions
    if (romanticChanged) {
        const improved = assessmentState.romanticScore > assessmentState.previousRomanticScore;
        
        if (improved) {
            if (assessmentState.previousRomanticLevel === 'casual' && assessmentState.romanticLevel === 'affectionate') {
                message += "Your emotional connection has deepened beautifully! You've moved beyond casual companionship into a more nurturing bond. ";
            } else if (assessmentState.previousRomanticLevel === 'affectionate' && assessmentState.romanticLevel === 'devoted') {
                message += "Your emotional bond has strengthened significantly! Your affection has matured into devoted commitment. ";
            } else if (assessmentState.previousRomanticLevel === 'devoted' && assessmentState.romanticLevel === 'soulmates') {
                message += "Your romantic connection has reached an extraordinary level! ";
            } else {
                message += "Your emotional connection has deepened since your last assessment. ";
            }
        }
    }
    
    return message.trim();
}

// Find compatibility description from matrix
function findCompatibilityDescription(eroticLevelKey, romanticLevelKey) {
    // Get the appropriate matrix based on relationship duration
    let matrix;
    if (assessmentState.relationshipDuration === 'established' && 
        assessmentState.establishedCompatibilityMatrix && 
        assessmentState.establishedCompatibilityMatrix.length > 0) {
        matrix = assessmentState.establishedCompatibilityMatrix;
    } else {
        matrix = assessmentState.compatibilityMatrix;
    }
    
    if (!matrix || !Array.isArray(matrix)) {
        return null;
    }
    
    // Find matching entry in compatibility matrix
    const matchingEntry = matrix.find(entry => 
        entry[0] === eroticLevelKey && entry[1] === romanticLevelKey
    );
    
    return matchingEntry ? matchingEntry[2] : null;
}

// Get erotic level key (internal key used in profile categories)
function getEroticLevelKey(percentage) {
    if (percentage >= 80) return "Fiery";
    if (percentage >= 60) return "daring";
    if (percentage >= 40) return "adventurous";
    if (percentage >= 20) return "curious";
    return "novice";
}

// Get romantic level key (internal key used in profile categories)
function getRomanticLevelKey(percentage) {
    if (percentage >= 80) return "soulmates";
    if (percentage >= 60) return "devoted";
    if (percentage >= 40) return "affectionate";
    return "casual";
}

// Get erotic level name (display name)
function getEroticLevel(percentage) {
    if (percentage >= 80) return "Fiery";
    if (percentage >= 60) return "Daring";
    if (percentage >= 40) return "Adventurous";
    if (percentage >= 20) return "Curious";
    return "Novice";
}

// Get romantic level name (display name)
function getRomanticLevel(percentage) {
    if (percentage >= 80) return "Soulmates";
    if (percentage >= 60) return "Devoted";
    if (percentage >= 40) return "Affectionate";
    return "Casual";
}

// Fallback profile description for when categories aren't available
function getProfileDescription(romanticLevel, eroticLevel) {
    return `Your relationship has a unique blend of ${romanticLevel} romantic connection and ${eroticLevel} erotic connection that defines your journey together.`;
}

// Update balance description based on the difference between scores
function updateBalanceDescription() {
    const balanceDescription = document.getElementById('balanceDescription');
    const difference = Math.abs(assessmentState.eroticScore - assessmentState.romanticScore);
    let balanceText = "";
    
    // Perfect/Near Balance (difference <= 10%)
    if (difference <= 10) {
        balanceText = "Your relationship shows remarkable harmony between emotional and physical connection. This balance creates a stable, satisfying bond where neither dimension overshadows the other.";
    } 
    // Slightly unbalanced (difference between 10% and 25%)
    else if (difference <= 25) {
        if (assessmentState.eroticScore > assessmentState.romanticScore) {
            balanceText = "Your physical connection gently leads your emotional bond, creating excitement with growing depth.";
        } else {
            balanceText = "Your emotional bond gently leads your physical connection, creating security with growing passion.";
        }
    } 
    // Strongly unbalanced (difference > 25%)
    else {
        if (assessmentState.eroticScore > assessmentState.romanticScore) {
            balanceText = "Your physical connection significantly outpaces your emotional intimacy. Consider investing in deeper emotional connection for more balance.";
        } else {
            balanceText = "Your emotional connection significantly outpaces your physical intimacy. Your exceptional trust provides the perfect foundation for exploration.";
        }
    }
    
    if (balanceDescription) balanceDescription.textContent = balanceText;
}

// Animate the gauges
function animateGauges() {
    const eroticPercentage = document.getElementById('eroticPercentage');
    const romanticPercentage = document.getElementById('romanticPercentage');
    const eroticGauge = document.getElementById('eroticGauge');
    const romanticGauge = document.getElementById('romanticGauge');
    
    // Update percentage text
    if (eroticPercentage) eroticPercentage.textContent = `${assessmentState.eroticScore}%`;
    if (romanticPercentage) romanticPercentage.textContent = `${assessmentState.romanticScore}%`;
    
    // Calculate needle angles
    // Convert percentage to degrees (0% = -90deg, 100% = 90deg)
    const eroticAngle = -90 + (assessmentState.eroticScore / 100 * 180);
    const romanticAngle = -90 + (assessmentState.romanticScore / 100 * 180);
    
    // Animate erotic gauge needle
    const eroticNeedle = eroticGauge?.querySelector('.gauge-needle');
    if (eroticNeedle) {
        eroticNeedle.style.setProperty('--rotation-angle', `${eroticAngle}deg`);
        eroticNeedle.style.transform = `rotate(${eroticAngle}deg)`;
        
        // Highlight active segment
        highlightActiveSegment(eroticGauge, assessmentState.eroticScore);
    }
    
    // Animate romantic gauge needle
    const romanticNeedle = romanticGauge?.querySelector('.gauge-needle');
    if (romanticNeedle) {
        romanticNeedle.style.setProperty('--rotation-angle', `${romanticAngle}deg`);
        romanticNeedle.style.transform = `rotate(${romanticAngle}deg)`;
        
        // Highlight active segment
        highlightActiveSegment(romanticGauge, assessmentState.romanticScore);
    }
}

// Highlight the active segment on the gauge
function highlightActiveSegment(gauge, score) {
    // Remove active class from all segments
    const segments = gauge.querySelectorAll('.gauge-segment');
    segments.forEach(segment => segment.classList.remove('active-segment'));
    
    // Determine which segment to highlight using the same thresholds as level functions
    let segmentIndex = 0;
    if (gauge.id === 'eroticGauge') {
        if (score >= 75) segmentIndex = 4;
        else if (score >= 55) segmentIndex = 3;
        else if (score >= 35) segmentIndex = 2;
        else if (score >= 15) segmentIndex = 1;
        else segmentIndex = 0;
    } else { // romanticGauge
        if (score >= 75) segmentIndex = 3;
        else if (score >= 55) segmentIndex = 2;
        else if (score >= 30) segmentIndex = 1;
        else segmentIndex = 0;
    }
    
    // Add active class to the appropriate segment
    const activeSegment = gauge.querySelector(`.gauge-segment-${segmentIndex + 1}`);
    if (activeSegment) activeSegment.classList.add('active-segment');
}

// Reset the assessment
function resetAssessment() {
    // Clear selected tasks
    assessmentState.selectedEroticTasks = [];
    assessmentState.selectedRomanticTasks = [];
    
    // Save the cleared state
    saveAssessmentState();
    
    // Rerender tasks
    renderTasks();
    
    // Update preview gauges
    updatePreviewGauges();
}

// Retake the assessment
function retakeAssessment() {
    // Show the assessment screen
    showScreen(document.getElementById('assessmentScreen'));
    
    // Force scroll to top using multiple methods
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Set location hash
    window.location.hash = '';
    window.location.hash = 'top-anchor';
    
    // Try again after a delay
    setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 100);
}

// Show a specific screen
function showScreen(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Show the selected screen
    screen.classList.add('active');
    
    // Add this line to scroll all possible containers
    document.querySelectorAll('.screen.active, body, html, .container').forEach(el => {
        if (el) el.scrollTop = 0;
    });
}

// Show error message
function showErrorMessage(message) {
    // Create a floating error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Add to body
    document.body.appendChild(errorElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(errorElement);
        }, 500);
    }, 5000);
}

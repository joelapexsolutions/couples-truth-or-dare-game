/**
 * Couples Truth or Dare - Website JavaScript
 * This file handles all interactive elements of the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initWebsite();
});

/**
 * Initialize all website components
 */
function initWebsite() {
    // Initialize navigation
    initNavigation();
    
    // Initialize game card interactions
    initGameCards();
    
    // Initialize demo games interactions
    initDemoGames();
    
    // Initialize testimonials slider
    initTestimonials();
    
    // Initialize modal functionality
    initModals();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize screenshots tabs
    initScreenshotsTabs();
    
    // Initialize screenshot carousel
    initScreenshotCarousel();
}

/**
 * Handle navigation functionality
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Subtract header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.background = 'rgba(26, 5, 5, 0.95)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.background = 'rgba(26, 5, 5, 0.9)';
            }
        }
    });
}

/**
 * Handle game card interactions
 */
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    const demoContainers = document.querySelectorAll('.demo-container');
    
    // Add hover effects to game cards
    gameCards.forEach(card => {
        // Add pulsing effect to icon on hover
        const icon = card.querySelector('.game-icon i');
        
        card.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.animation = 'heartbeat 1.5s infinite';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.animation = 'none';
            }
        });
        
        // Handle try button click
        const tryButton = card.querySelector('.try-button');
        if (tryButton) {
            tryButton.addEventListener('click', function() {
                const gameType = this.getAttribute('data-game');
                
                // Hide all demo containers
                demoContainers.forEach(container => {
                    container.classList.remove('active');
                });
                
                // Show the selected demo container
                const targetDemo = document.getElementById(gameType + 'Demo');
                if (targetDemo) {
                    targetDemo.classList.add('active');
                    
                    // Scroll to demo section
                    document.getElementById('demo').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

/**
 * Initialize demo games functionality
 */
function initDemoGames() {
    // Initialize Truth or Dare demo
    initTruthOrDareDemo();
    
    // Initialize Couples Tasks demo
    initCouplesTasksDemo();
    
    // Initialize Who's More Likely demo
    initWhosMoreDemo();
    
    // Initialize Intimacy Profile demo
    initIntimacyProfileDemo();
}

/**
 * Truth or Dare demo functionality
 */
function initTruthOrDareDemo() {
    const truthButton = document.getElementById('truthButton');
    const dareButton = document.getElementById('dareButton');
    const demoQuestion = document.getElementById('demoQuestion');
    const levelButtons = document.querySelectorAll('.level-button');
    
    // Sample questions and dares for each level
    const demoContent = {
        Soft: {
            truths: [
                "What was your first impression of your partner?",
                "What's one small thing your partner does that you find adorable?",
                "What's your favorite physical feature of your partner?",
                "When did you first realize you were falling for your partner?"
            ],
            dares: [
                "Give your partner a 30-second shoulder massage.",
                "Write down three things you love about your partner and read them aloud.",
                "Feed your partner their favorite snack.",
                "Draw a heart on your partner's palm and kiss it."
            ]
        },
        Sensual: {
            truths: [
                "What's your favorite way to be kissed?",
                "What outfit would you love to see your partner wear?",
                "What's a romantic fantasy you'd like to experience with your partner?",
                "What's something your partner does that always turns you on?"
            ],
            dares: [
                "Kiss your partner's neck for 15 seconds.",
                "Whisper something seductive in your partner's ear.",
                "Slow dance with your partner to a romantic song.",
                "Give your partner a gentle back scratch under their shirt."
            ]
        },
        Hot: {
            truths: [
                "This level is available in the full app!",
                "Download to unlock spicier questions and dares.",
                "The Hot level features more intimate questions to deepen your connection."
            ],
            dares: [
                "This level is available in the full app!",
                "Download to unlock spicier challenges.",
                "The Hot level features more intimate dares to explore together."
            ]
        },
        Explicit: {
            truths: [
                "This level is available in the full app!",
                "Download to unlock our most intimate questions.",
                "The Explicit level is designed for couples seeking deep intimacy."
            ],
            dares: [
                "This level is available in the full app!",
                "Download to unlock our most intense challenges.",
                "The Explicit level is perfect for adventurous couples."
            ]
        }
    };
    
    let currentLevel = 'Soft';
    
    // Handle level selection
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Skip if level is locked
            if (this.classList.contains('locked')) {
                showPremiumModal();
                return;
            }
            
            // Update active level
            levelButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentLevel = this.getAttribute('data-level');
            
            // Reset question display
            demoQuestion.textContent = "Click 'Truth' or 'Dare' to get started!";
        });
    });
    
    // Handle Truth button click
    if (truthButton) {
        truthButton.addEventListener('click', function() {
            const truths = demoContent[currentLevel].truths;
            const randomIndex = Math.floor(Math.random() * truths.length);
            
            // Animate the text change
            demoQuestion.style.opacity = '0';
            
            setTimeout(() => {
                demoQuestion.textContent = truths[randomIndex];
                demoQuestion.style.opacity = '1';
            }, 300);
            
            // Show premium modal for locked levels
            if (currentLevel === 'Hot' || currentLevel === 'Explicit') {
                setTimeout(showPremiumModal, 1500);
            }
        });
    }
    
    // Handle Dare button click
    if (dareButton) {
        dareButton.addEventListener('click', function() {
            const dares = demoContent[currentLevel].dares;
            const randomIndex = Math.floor(Math.random() * dares.length);
            
            // Animate the text change
            demoQuestion.style.opacity = '0';
            
            setTimeout(() => {
                demoQuestion.textContent = dares[randomIndex];
                demoQuestion.style.opacity = '1';
            }, 300);
            
            // Show premium modal for locked levels
            if (currentLevel === 'Hot' || currentLevel === 'Explicit') {
                setTimeout(showPremiumModal, 1500);
            }
        });
    }
}

/**
 * Couples Tasks demo functionality
 */
function initCouplesTasksDemo() {
    const taskDisplay = document.getElementById('taskDisplay');
    const romanticGauge = document.getElementById('romanticGauge');
    const passionGauge = document.getElementById('passionGauge');
    const romanticLevel = document.getElementById('romanticLevel');
    const passionLevel = document.getElementById('passionLevel');
    const typeButtons = document.querySelectorAll('.type-button');
    
    // Sample tasks for each type
    const tasks = {
        romantic: [
            "Write a short love note and hide it where your partner will find it tomorrow.",
            "Plan a surprise date night based on your partner's interests.",
            "Create a playlist of songs that remind you of special moments together.",
            "Take a photo together in the same pose as your favorite picture from when you first met.",
            "Share three things you admire about your partner's character."
        ],
        passion: [
            "Create a unique massage oil blend and give your partner a relaxing massage.",
            "Share your favorite intimate fantasy with your partner.",
            "Take turns telling each other what you find most attractive about one another.",
            "Try a new kissing technique you've never done before.",
            "Describe what makes your partner irresistible in three words."
        ]
    };
    
    let currentType = 'romantic';
    let romanticProgress = 20;
    let passionProgress = 20;
    
    // Initialize gauge levels
    updateGauges();
    
    // Handle type selection
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentType = this.getAttribute('data-type');
            
            // Generate random task
            generateRandomTask();
        });
    });
    
    // Generate random task based on selected type
    function generateRandomTask() {
        const typeArray = tasks[currentType];
        const randomIndex = Math.floor(Math.random() * typeArray.length);
        
        // Animate the text change
        taskDisplay.style.opacity = '0';
        
        setTimeout(() => {
            taskDisplay.textContent = typeArray[randomIndex];
            taskDisplay.style.opacity = '1';
            
            // Add complete button if not already present
            if (!document.getElementById('completeTaskButton')) {
                const completeButton = document.createElement('button');
                completeButton.id = 'completeTaskButton';
                completeButton.className = 'try-button';
                completeButton.textContent = 'Complete Task';
                completeButton.style.marginTop = '20px';
                taskDisplay.insertAdjacentElement('afterend', completeButton);
                
                // Add event listener to complete button
                completeButton.addEventListener('click', function() {
                    // Increase the corresponding gauge
                    if (currentType === 'romantic') {
                        romanticProgress += 15;
                        if (romanticProgress > 100) romanticProgress = 100;
                    } else {
                        passionProgress += 15;
                        if (passionProgress > 100) passionProgress = 100;
                    }
                    
                    // Update gauges
                    updateGauges();
                    
                    // Generate new task
                    generateRandomTask();
                    
                    // Show premium modal after a few completed tasks
                    if (romanticProgress >= 50 || passionProgress >= 50) {
                        setTimeout(showPremiumModal, 1500);
                    }
                });
            }
        }, 300);
    }
    
    // Update gauge visuals
    function updateGauges() {
        // Update romantic gauge
        romanticGauge.style.width = romanticProgress + '%';
        
        if (romanticProgress < 25) {
            romanticLevel.textContent = 'Blooming';
        } else if (romanticProgress < 50) {
            romanticLevel.textContent = 'Partners';
        } else if (romanticProgress < 75) {
            romanticLevel.textContent = 'Devoted';
        } else {
            romanticLevel.textContent = 'Soulmates';
        }
        
        // Update passion gauge
        passionGauge.style.width = passionProgress + '%';
        
        if (passionProgress < 25) {
            passionLevel.textContent = 'Spark';
        } else if (passionProgress < 50) {
            passionLevel.textContent = 'Flame';
        } else if (passionProgress < 75) {
            passionLevel.textContent = 'Blaze';
        } else {
            passionLevel.textContent = 'Inferno';
        }
    }
    
    // Generate initial task
    setTimeout(generateRandomTask, 500);
}

/**
 * Who's More Likely demo functionality
 */
function initWhosMoreDemo() {
    const whosMoreQuestion = document.getElementById('whosMoreQuestion');
    const himButton = document.getElementById('himButton');
    const herButton = document.getElementById('herButton');
    
    // Sample questions
    const questions = [
        "Who's more likely to forget an important date?",
        "Who's more likely to say 'I love you' first?",
        "Who's more likely to plan a surprise date?",
        "Who's more likely to get lost while driving?",
        "Who's more likely to cry during a movie?",
        "Who's more likely to take risks?",
        "Who's more likely to apologize first after an argument?",
        "Who's more likely to spend too much money on a gift?"
    ];
    
    let questionIndex = 0;
    let questionsAnswered = 0;
    
    // Handle button clicks
    if (himButton && herButton) {
        himButton.addEventListener('click', answerQuestion);
        herButton.addEventListener('click', answerQuestion);
    }
    
    // Answer question and move to next one
    function answerQuestion() {
        questionsAnswered++;
        
        // Show new question with animation
        whosMoreQuestion.style.opacity = '0';
        
        setTimeout(() => {
            questionIndex = (questionIndex + 1) % questions.length;
            whosMoreQuestion.textContent = questions[questionIndex];
            whosMoreQuestion.style.opacity = '1';
            
            // Show premium modal after 3 questions
            if (questionsAnswered === 3) {
                setTimeout(showPremiumModal, 1500);
            }
        }, 300);
    }
}

/**
 * Intimacy Profile demo functionality
 */
function initIntimacyProfileDemo() {
    const eroticGauge = document.getElementById('eroticGauge');
    const romanticProfileGauge = document.getElementById('romanticProfileGauge');
    const eroticLevel = document.getElementById('eroticLevel');
    const romanticProfileLevel = document.getElementById('romanticProfileLevel');
    
    // Set initial gauge levels
    setGaugeValue(eroticGauge, 20);
    setGaugeValue(romanticProfileGauge, 25);
    
    // Create assessment button
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        const assessmentButton = document.createElement('button');
        assessmentButton.textContent = 'Take Assessment Sample';
        assessmentButton.className = 'try-button';
        assessmentButton.style.marginTop = '20px';
        profileInfo.appendChild(assessmentButton);
        
        // Add event listener to assessment button
        assessmentButton.addEventListener('click', function() {
            // Show premium modal after clicking the button
            showPremiumModal();
        });
    }
    
    // Set gauge value with the correct conic gradient
    function setGaugeValue(gaugeElement, value) {
        if (gaugeElement) {
            const degree = Math.min(value * 3.6, 360); // Convert percentage to degrees (max 360)
            gaugeElement.style.background = `conic-gradient(
                var(--primary-color) ${degree}deg,
                #444 ${degree}deg
            )`;
        }
    }
}

/**
 * Initialize testimonials slider
 */
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.testimonial-control.prev');
    const nextButton = document.querySelector('.testimonial-control.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentTestimonial = 0;
    
    // Hide all testimonials except the first one
    if (testimonialCards.length > 1) {
        for (let i = 1; i < testimonialCards.length; i++) {
            testimonialCards[i].style.display = 'none';
        }
    }
    
    // Handle prev button click
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            showTestimonial(currentTestimonial - 1);
        });
    }
    
    // Handle next button click
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            showTestimonial(currentTestimonial + 1);
        });
    }
    
    // Handle indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Show testimonial at specified index
    function showTestimonial(index) {
        // Handle index out of bounds
        if (index < 0) {
            index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
            index = 0;
        }
        
        // Hide current testimonial
        testimonialCards[currentTestimonial].style.display = 'none';
        indicators[currentTestimonial].classList.remove('active');
        
        // Show new testimonial
        testimonialCards[index].style.display = 'block';
        indicators[index].classList.add('active');
        
        // Update current index
        currentTestimonial = index;
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 8000);
}

/**
 * Initialize modal functionality
 */
function initModals() {
    const premiumModal = document.getElementById('premiumModal');
    const closeModal = document.querySelector('.close-modal');
    const modalButtons = document.querySelectorAll('.modal-button');
    
    // Close modal when close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            premiumModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside of modal content
    if (premiumModal) {
        premiumModal.addEventListener('click', function(e) {
            if (e.target === premiumModal) {
                premiumModal.classList.remove('active');
            }
        });
    }
    
    // Handle modal button clicks
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Close the modal
            premiumModal.classList.remove('active');
            
            // Scroll to download section if link contains #download
            if (this.getAttribute('href') === '#download') {
                document.getElementById('download').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Show premium features modal
 */
function showPremiumModal() {
    const premiumModal = document.getElementById('premiumModal');
    if (premiumModal) {
        premiumModal.classList.add('active');
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Add animation to elements when they enter the viewport
    const animateElements = document.querySelectorAll('.game-card, .benefit-card, .section-header');
    
    // Initialize observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize screenshots tabs functionality
 */
function initScreenshotsTabs() {
    const tabs = document.querySelectorAll('.screenshot-tab');
    const items = document.querySelectorAll('.screenshot-item');
    
    if (tabs.length && items.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get selected category
                const category = this.getAttribute('data-tab');
                
                // Filter items
                items.forEach(item => {
                    const itemCategories = item.getAttribute('data-category').split(' ');
                    if (category === 'all' || itemCategories.includes(category)) {
                        item.style.display = 'block';
                        // Add fade-in animation
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize screenshot carousel
 */
function initScreenshotCarousel() {
    const carousel = document.querySelector('.screenshot-carousel');
    if (carousel) {
        // Auto-scroll the carousel
        setInterval(() => {
            carousel.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
            
            // Reset scroll if reached the end
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 100) {
                setTimeout(() => {
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 1000);
            }
        }, 5000);
    }
}

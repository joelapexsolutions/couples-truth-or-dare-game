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
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize screenshots tabs
    initScreenshotsTabs();
    
    // Initialize screenshot carousel
    initScreenshotCarousel();
    
    // Initialize long distance feature animations
    initLongDistanceAnimations();
    
    // Initialize age verification for erotic packs
    initAgeVerification();
}

/**
 * Initialize age verification for erotic packs
 */
function initAgeVerification() {
    const eroticDownloadButtons = document.querySelectorAll('.erotic-download');
    const ageModal = document.getElementById('ageVerificationModal');
    const closeAgeModal = document.getElementById('closeAgeModal');
    const cancelDownload = document.getElementById('cancelDownload');
    const confirmDownload = document.getElementById('confirmDownload');
    
    let currentPackUrl = '';
    let currentFilename = '';
    
    // Handle erotic pack download button clicks
    eroticDownloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store the pack details
            currentPackUrl = this.getAttribute('data-pack');
            currentFilename = this.getAttribute('data-filename');
            
            // Show age verification modal
            if (ageModal) {
                ageModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });
    
    // Handle close modal button
    if (closeAgeModal) {
        closeAgeModal.addEventListener('click', function() {
            closeAgeVerificationModal();
        });
    }
    
    // Handle cancel button
    if (cancelDownload) {
        cancelDownload.addEventListener('click', function() {
            closeAgeVerificationModal();
        });
    }
    
    // Handle confirm download button
    if (confirmDownload) {
        confirmDownload.addEventListener('click', function() {
            // Proceed with download
            if (currentPackUrl && currentFilename) {
                // Create a temporary link element and trigger download
                const link = document.createElement('a');
                link.href = currentPackUrl;
                link.download = currentFilename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                showDownloadSuccess();
            }
            
            // Close modal
            closeAgeVerificationModal();
        });
    }
    
    // Close modal when clicking outside
    if (ageModal) {
        ageModal.addEventListener('click', function(e) {
            if (e.target === ageModal) {
                closeAgeVerificationModal();
            }
        });
    }
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && ageModal && ageModal.classList.contains('active')) {
            closeAgeVerificationModal();
        }
    });
    
    function closeAgeVerificationModal() {
        if (ageModal) {
            ageModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
        // Reset current pack details
        currentPackUrl = '';
        currentFilename = '';
    }
    
    function showDownloadSuccess() {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Download started! Check your downloads folder.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 3000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s forwards;
        `;
        
        // Remove notification after 3.5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3500);
    }
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
                if (navLinks && navLinks.classList.contains('active')) {
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
                
                // Check if this is the intimacy profile game
                if (gameType === 'intimacyProfile') {
                    // Redirect to the standalone intimacy profile page
                    window.location.href = 'couples-intimacy-profile.html';
                    return;
                }
                
                // Hide all demo containers
                demoContainers.forEach(container => {
                    container.classList.remove('active');
                });
                
                // Show the selected demo container
                const targetDemo = document.getElementById(gameType + 'Demo');
                if (targetDemo) {
                    targetDemo.classList.add('active');
                    
                    // Scroll to demo section
                    const demoSection = document.getElementById('demo');
                    if (demoSection) {
                        demoSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
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
            if (demoQuestion) {
                demoQuestion.textContent = "Click 'Truth' or 'Dare' to get started!";
            }
        });
    });
    
    // Handle Truth button click
    if (truthButton) {
        truthButton.addEventListener('click', function() {
            const truths = demoContent[currentLevel].truths;
            const randomIndex = Math.floor(Math.random() * truths.length);
            
            if (demoQuestion) {
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
            }
        });
    }
    
    // Handle Dare button click
    if (dareButton) {
        dareButton.addEventListener('click', function() {
            const dares = demoContent[currentLevel].dares;
            const randomIndex = Math.floor(Math.random() * dares.length);
            
            if (demoQuestion) {
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
        if (!taskDisplay) return;
        
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
        if (romanticGauge) {
            romanticGauge.style.width = romanticProgress + '%';
        }
        
        if (romanticLevel) {
            if (romanticProgress < 25) {
                romanticLevel.textContent = 'Blooming';
            } else if (romanticProgress < 50) {
                romanticLevel.textContent = 'Partners';
            } else if (romanticProgress < 75) {
                romanticLevel.textContent = 'Devoted';
            } else {
                romanticLevel.textContent = 'Soulmates';
            }
        }
        
        // Update passion gauge
        if (passionGauge) {
            passionGauge.style.width = passionProgress + '%';
        }
        
        if (passionLevel) {
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
        
        if (whosMoreQuestion) {
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
        assessmentButton.textContent = 'Take Full Assessment';
        assessmentButton.className = 'try-button';
        assessmentButton.style.marginTop = '20px';
        profileInfo.appendChild(assessmentButton);
        
        // Add event listener to assessment button
        assessmentButton.addEventListener('click', function() {
            // Redirect to the full assessment page
            window.location.href = 'couples-intimacy-profile.html';
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
 * Initialize FAQ functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
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
        if (testimonialCards[currentTestimonial]) {
            testimonialCards[currentTestimonial].style.display = 'none';
        }
        if (indicators[currentTestimonial]) {
            indicators[currentTestimonial].classList.remove('active');
        }
        
        // Show new testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].style.display = 'block';
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
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
            if (premiumModal) {
                premiumModal.classList.remove('active');
            }
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
            if (premiumModal) {
                premiumModal.classList.remove('active');
            }
            
            // Scroll to download section if link contains #download
            if (this.getAttribute('href') === '#download') {
                const downloadSection = document.getElementById('download');
                if (downloadSection) {
                    downloadSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
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
    const animateElements = document.querySelectorAll('.game-card, .benefit-card, .section-header, .ld-feature');
    
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
                    const itemCategories = item.getAttribute('data-category');
                    if (itemCategories && (category === 'all' || itemCategories.includes(category))) {
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

/**
 * Initialize long distance feature animations
 */
function initLongDistanceAnimations() {
    // Animate connection pulse
    const connectionPulse = document.querySelector('.connection-pulse');
    if (connectionPulse) {
        // Already handled by CSS animation
    }
    
    // Add hover effects to LD buttons
    const ldButtons = document.querySelectorAll('.ld-button');
    ldButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add intersection observer for LD stats
    const ldStats = document.querySelectorAll('.ld-stat');
    const ldObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    animateNumber(statNumber);
                }
                ldObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    ldStats.forEach(stat => {
        ldObserver.observe(stat);
    });
    
    // Animate number counting
    function animateNumber(element) {
        const target = element.textContent;
        const isNumberOnly = !isNaN(target.replace('+', ''));
        
        if (isNumberOnly) {
            const finalNumber = parseInt(target.replace('+', ''));
            let current = 0;
            const increment = finalNumber / 50; // 50 steps
            const hasPlus = target.includes('+');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }, 30);
        }
    }
    
    // Add device hover effects
    const devices = document.querySelectorAll('.device');
    devices.forEach(device => {
        device.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize AdSense ads
 */
function initializeAds() {
    try {
        // Check if AdSense is loaded
        if (typeof window.adsbygoogle === 'undefined') {
            console.log('AdSense not loaded yet, retrying...');
            setTimeout(initializeAds, 1000);
            return;
        }
        
        // Find all uninitialized ads
        const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
        console.log('Found', ads.length, 'uninitialized ads');
        
        if (ads.length > 0) {
            // Initialize each ad
            ads.forEach((ad, index) => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log('Initialized ad', index + 1);
                } catch (error) {
                    console.error('Error initializing ad', index + 1, error);
                }
            });
        }
        
        console.log('AdSense ads initialization complete');
    } catch (error) {
        console.error('Error in initializeAds:', error);
    }
}

// Initialize ads when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing ads...');
    setTimeout(initializeAds, 2000);
});

// Also try when window loads
window.addEventListener('load', function() {
    setTimeout(initializeAds, 3000);
});

/**
 * Show interstitial ad with session management
 */
function showInterstitialAd(reason = 'general') {
    // Check if we should show an interstitial
    if (!shouldShowInterstitial()) {
        console.log('Interstitial ad skipped due to cooldown/session');
        return;
    }
    
    // Create interstitial modal
    const modal = document.createElement('div');
    modal.className = 'interstitial-ad-modal';
    modal.innerHTML = `
        <div class="interstitial-ad-content">
            <div class="interstitial-ad-header">
                <span class="ad-label">Advertisement</span>
                <button class="close-interstitial" onclick="closeInterstitialAd()">&times;</button>
            </div>
            <div class="interstitial-ad-body">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-3261569477417964"
                     data-ad-slot="1864255122"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
            <div class="interstitial-ad-footer">
                <button class="continue-button" onclick="closeInterstitialAd()">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Load the ad
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.error('Error loading interstitial ad:', error);
    }
    
    // Mark as shown
    markInterstitialShown();
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
}

/**
 * Close interstitial ad
 */
function closeInterstitialAd() {
    const modal = document.querySelector('.interstitial-ad-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    }
}

/**
 * Check if we should show interstitial ad
 */
function shouldShowInterstitial() {
    const lastShown = localStorage.getItem(window.adConfig.lastInterstitialKey);
    const sessionShown = sessionStorage.getItem(window.adConfig.interstitialShownKey);
    
    // Don't show if already shown this session
    if (sessionShown) {
        return false;
    }
    
    // Check cooldown period
    if (lastShown) {
        const lastShownTime = new Date(lastShown);
        const now = new Date();
        const hoursSinceLastShown = (now - lastShownTime) / (1000 * 60 * 60);
        
        if (hoursSinceLastShown < window.adConfig.cooldownHours) {
            return false;
        }
    }
    
    return true;
}

/**
 * Mark interstitial as shown
 */
function markInterstitialShown() {
    sessionStorage.setItem(window.adConfig.interstitialShownKey, 'true');
    localStorage.setItem(window.adConfig.lastInterstitialKey, new Date().toISOString());
}

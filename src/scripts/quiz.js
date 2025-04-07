// Import necessary files
import riddles from './questions.js';
import { saveScoreToDatabase, getScoresFromDatabase } from './database.js';

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Quiz initialization started');
    
    try {
        setupEventListeners();
        console.log('Quiz initialization completed');
    } catch (error) {
        console.error('Error initializing quiz:', error);
    }
});

// DOM Elements
let homeEl;
let registrationEl;
let quizContainerEl;
let highscoresEl;
let highscoreListEl;
let endEl;
let finalScoreEl;
let finalTimeEl;

// Buttons
let startBtn;
let startQuizBtn;
let backHomeBtn;
let highscoreBtn;
let playAgainBtn;
let goHomeBtn;
let clearHighscoresBtn;
let returnHomeBtn;

// User data
let userData = null;

// Get user data from localStorage
function loadUserData() {
    const storedData = localStorage.getItem('quizUserData');
    if (storedData) {
        userData = JSON.parse(storedData);
        console.log('User data loaded:', userData);
        return true;
    }
    console.error('No user data found in localStorage');
    return false;
}

// Add MCQ questions to the quiz
const mcqQuestions = [
    {
        question: "What rare material hides inside your dusty old PC like a treasure chest?",
        options: [
            "Gold",
            "Bronze",
            "Kryptonite",
            "Marshmallows"
        ],
        answer: 0, // Index of the correct answer (A. Gold)
        explanation: "Computers and other electronic devices contain small amounts of precious metals like gold, especially in circuit boards and connectors."
    },
    {
        question: "Why did the battery go to therapy?",
        options: [
            "It had too many charges",
            "It couldn't handle the pressure",
            "It felt drained",
            "It had explosive issues"
        ],
        answer: 3, // Index of the correct answer (D. It had explosive issues)
        explanation: "Batteries can be dangerous if damaged or improperly disposed of, potentially causing fires or explosions."
    },
    {
        question: "What's the \"greenest\" thing to do with your old but working laptop?",
        options: [
            "Launch it into space",
            "Paint it green",
            "Donate it or sell it",
            "Use it as a dinner plate"
        ],
        answer: 2, // Index of the correct answer (C. Donate it or sell it)
        explanation: "Extending the life of electronics through reuse is the most environmentally friendly option before recycling."
    }
];

// Create a combined sequence of riddles and MCQs
const createMixedQuestionSequence = () => {
    console.log('Creating mixed question sequence');
    const sequence = [];
    const mcqPositions = [1, 3, 5]; // Place MCQs after the 1st, 3rd, and 5th riddles
    
    let mcqIndex = 0;
    let riddleIndex = 0;
    
    // Create a sequence that alternates between riddles and MCQs
    for (let i = 0; i < riddles.length + mcqQuestions.length; i++) {
        if (mcqPositions.includes(i) && mcqIndex < mcqQuestions.length) {
            // Add an MCQ at specified positions
            sequence.push({
                type: 'mcq',
                data: mcqQuestions[mcqIndex]
            });
            mcqIndex++;
        } else if (riddleIndex < riddles.length) {
            // Add a riddle
            sequence.push({
                type: 'riddle',
                data: riddles[riddleIndex]
            });
            riddleIndex++;
        }
    }
    
    console.log('Created sequence with', sequence.length, 'questions');
    return sequence;
};

// Quiz variables
let score = 0;
let quizTimer;
let quizStartTime;
let quizEndTime;
let quizDuration;
let currentQuestionIndex = 0;
let attemptCount = 0;
const MAX_ATTEMPTS_BEFORE_HINT = 2;
let questionSequence = [];

function setupEventListeners() {
    // Get DOM Elements with console logging
    try {
        console.log('Setting up event listeners...');
        
        homeEl = document.getElementById('home');
        console.log('Home element found:', !!homeEl);
        
        registrationEl = document.getElementById('registration');
        console.log('Registration element found:', !!registrationEl);
        
        quizContainerEl = document.getElementById('quiz-container');
        console.log('Quiz container element found:', !!quizContainerEl);
        
        endEl = document.getElementById('end');
        console.log('End element found:', !!endEl);
        
        finalScoreEl = document.getElementById('final-score');
        finalTimeEl = document.getElementById('final-time');
        highscoresEl = document.getElementById('highscores');
        highscoreListEl = document.getElementById('highscore-list');

        // Get buttons
        startBtn = document.getElementById('start-btn');
        console.log('Start button found:', !!startBtn);
        
        startQuizBtn = document.getElementById('start-quiz-btn');
        backHomeBtn = document.getElementById('back-home-btn');
        highscoreBtn = document.getElementById('highscore-btn');
        playAgainBtn = document.getElementById('play-again-btn');
        goHomeBtn = document.getElementById('go-home-btn');
        clearHighscoresBtn = document.getElementById('clear-highscores-btn');
        returnHomeBtn = document.getElementById('return-home-btn');

        // Add Event Listeners
        if (startBtn) {
            startBtn.onclick = function() {
                console.log('Start button clicked! Showing registration form');
                showRegistration();
            };
        }
        
        // Registration form submission
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.onsubmit = function(e) {
                e.preventDefault();
                handleRegistrationSubmit();
            };
        }
        
        // Back button on registration
        if (backHomeBtn) {
            backHomeBtn.onclick = function() {
                hideAllSections();
                homeEl.classList.remove('hide');
            };
        }
        
        if (highscoreBtn) highscoreBtn.onclick = showHighscores;
        if (playAgainBtn) playAgainBtn.onclick = showRegistration; // Show registration instead of directly starting
        if (goHomeBtn) goHomeBtn.onclick = goHome;
        if (clearHighscoresBtn) clearHighscoresBtn.onclick = clearHighscores;
        if (returnHomeBtn) returnHomeBtn.onclick = goHome;

        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Show registration form
function showRegistration() {
    console.log('Showing registration form');
    hideAllSections();
    registrationEl.classList.remove('hide');
}

// Handle registration form submission
function handleRegistrationSubmit() {
    console.log('Registration form submitted');
    
    const rollnoInput = document.getElementById('reg-rollno');
    const nameInput = document.getElementById('reg-name');
    
    if (rollnoInput && nameInput) {
        const rollno = rollnoInput.value.trim();
        const name = nameInput.value.trim();
        
        if (rollno && name) {
            // Store user data
            userData = { rollno, name };
            localStorage.setItem('quizUserData', JSON.stringify(userData));
            
            console.log('User registered:', userData);
            
            // Start the quiz
            startMixedQuiz();
        } else {
            alert('Please enter both your roll number and name.');
        }
    } else {
        console.error('Could not find registration form inputs');
    }
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Start the timer for the quiz
function startTimer() {
    console.log('Starting timer');
    quizStartTime = Date.now();
    let seconds = 0;
    
    // Clear any existing timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Create the timer interval
    quizTimer = setInterval(() => {
        seconds++;
        // Find the timer element and update it
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = formatTime(seconds);
        }
    }, 1000);
}

// Stop the timer and calculate duration
function stopTimer() {
    console.log('Stopping timer');
    clearInterval(quizTimer);
    quizEndTime = Date.now();
    quizDuration = Math.floor((quizEndTime - quizStartTime) / 1000); // Duration in seconds
    return quizDuration;
}

// Start the mixed quiz
function startMixedQuiz() {
    console.log('startMixedQuiz function called');
    score = 0;
    currentQuestionIndex = 0;
    attemptCount = 0;
    
    try {
        // Create the mixed question sequence
        questionSequence = createMixedQuestionSequence();
        console.log('Created question sequence with', questionSequence.length, 'questions');
        
        // Hide all sections first
        hideAllSections();
        
        // Show quiz container
        console.log('Showing quiz container');
        quizContainerEl.classList.remove('hide');
        
        // Display the first question
        console.log('Displaying first question');
        displayCurrentQuestion();
        
        // Start the timer AFTER the question is displayed
        startTimer();
    } catch (error) {
        console.error('Error starting quiz:', error);
        alert('There was an error starting the quiz. Check the console for details.');
    }
}

function displayCurrentQuestion() {
    console.log('Displaying question:', currentQuestionIndex);
    try {
        const currentQuestion = questionSequence[currentQuestionIndex];
        
        if (currentQuestion.type === 'riddle') {
            displayRiddle(currentQuestion.data);
        } else {
            displayMCQ(currentQuestion.data);
        }
    } catch (error) {
        console.error('Error displaying question:', error);
    }
}

function displayRiddle(riddle) {
    console.log('Displaying riddle:', riddle.question);
    try {
        quizContainerEl.innerHTML = `
            <div id="quiz-header">
                <div class="hud">
                    <div class="hud-item">
                        <p class="hud-prefix">Question</p>
                        <h2 id="question-counter">${currentQuestionIndex + 1}/${questionSequence.length}</h2>
                    </div>
                    <div class="hud-item">
                        <p class="hud-prefix">Score</p>
                        <h2 id="score">${score}</h2>
                    </div>
                    <div class="hud-item">
                        <p class="hud-prefix">Time</p>
                        <h2 id="timer">00:00</h2>
                    </div>
                </div>
                <div id="progress-bar">
                    <div id="progress-fill" style="width: ${((currentQuestionIndex + 1) / questionSequence.length) * 100}%"></div>
                </div>
            </div>
            <h2>E-Waste Riddle</h2>
            <div class="riddle-text">${riddle.question}</div>
            <div class="input-container">
                <input type="text" id="riddle-answer" placeholder="Type your answer here...">
                <button id="submit-answer">Submit</button>
            </div>
            <div id="riddle-feedback"></div>
            <div id="hint-container" class="hidden"></div>
            <div class="next-button-container">
                <button id="next-question" class="btn-secondary">Skip to Next Question</button>
            </div>
        `;
        
        // Reset attempt count for new riddle
        attemptCount = 0;
        
        // Add event listener to the submit button
        document.getElementById('submit-answer').addEventListener('click', () => checkRiddleAnswer(riddle));
        
        // Add event listener to the next question button
        document.getElementById('next-question').addEventListener('click', () => {
            moveToNextQuestion(false); // false means no points awarded
        });
        
        // Add enter key event listener for the input field
        document.getElementById('riddle-answer').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                checkRiddleAnswer(riddle);
            }
        });
    } catch (error) {
        console.error('Error rendering riddle:', error);
    }
}

function displayMCQ(mcq) {
    console.log('Displaying MCQ:', mcq.question);
    try {
        quizContainerEl.innerHTML = `
            <div id="quiz-header">
                <div class="hud">
                    <div class="hud-item">
                    <p class="hud-prefix">Question</p>
                    <h2 id="question-counter">${currentQuestionIndex + 1}/${questionSequence.length}</h2>
                    </div>
                    <div class="hud-item">
                    <p class="hud-prefix">Score</p>
                    <h2 id="score">${score}</h2>
                    </div>
                    <div class="hud-item">
                    <p class="hud-prefix">Time</p>
                    <h2 id="timer">00:00</h2>
                    </div>
                </div>
                <div id="progress-bar">
                    <div id="progress-fill" style="width: ${((currentQuestionIndex + 1) / questionSequence.length) * 100}%"></div>
                </div>
            </div>
            <h2>Multiple Choice Question</h2>
            <div class="mcq-text">${mcq.question}</div>
            <div class="mcq-options">
                ${mcq.options.map((option, index) => `
                    <div class="mcq-option">
                        <button class="option-btn" data-index="${index}">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    </div>
                `).join('')}
            </div>
            <div id="mcq-feedback"></div>
            <div class="next-button-container">
                <button id="next-question" class="btn-secondary">Skip to Next Question</button>
            </div>
        `;
        
        // Add event listeners for options
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => {
                checkMCQAnswer(mcq, parseInt(button.getAttribute('data-index')));
            });
        });
        
        // Add event listener to the next question button
        document.getElementById('next-question').addEventListener('click', () => {
            moveToNextQuestion(false); // false means no points awarded
        });
    } catch (error) {
        console.error('Error rendering MCQ:', error);
    }
}

function checkRiddleAnswer(riddle) {
    try {
        const userAnswer = document.getElementById('riddle-answer').value.trim().toLowerCase();
        const feedbackElement = document.getElementById('riddle-feedback');
        const hintContainer = document.getElementById('hint-container');
        const answerInput = document.getElementById('riddle-answer');
        
        if (userAnswer === riddle.answer.toLowerCase()) {
            // Correct answer - add green highlight
            answerInput.classList.remove('incorrect-input');
            answerInput.classList.add('correct-input');
            feedbackElement.innerHTML = `<span class="correct">Correct! Well done!</span>`;
            feedbackElement.className = "correct-feedback";
            
            // Increment score
            score += 10;
            document.getElementById('score').textContent = score;
            
            // Move to next question after a short delay
            setTimeout(() => {
                moveToNextQuestion(true); // true means points were awarded
            }, 1500);
        } else {
            // Wrong answer - add red highlight
            answerInput.classList.remove('correct-input');
            answerInput.classList.add('incorrect-input');
            
            attemptCount++;
            
            if (attemptCount >= MAX_ATTEMPTS_BEFORE_HINT) {
                // Show hint after 2 wrong attempts
                hintContainer.innerHTML = `<strong>Hint:</strong> ${riddle.hint}`;
                hintContainer.className = "hint-shown";
            }
            
            feedbackElement.innerHTML = `<span class="incorrect">Try again!</span>`;
            feedbackElement.className = "incorrect-feedback";
        }
    } catch (error) {
        console.error('Error checking riddle answer:', error);
    }
}

function checkMCQAnswer(mcq, selectedIndex) {
    try {
        const feedbackElement = document.getElementById('mcq-feedback');
        const optionButtons = document.querySelectorAll('.option-btn');
        
        // Disable all buttons to prevent multiple selections
        optionButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
        
        if (selectedIndex === mcq.answer) {
            // Correct answer
            optionButtons[selectedIndex].classList.add('correct-option');
            feedbackElement.innerHTML = `<span class="correct">Correct! ${mcq.explanation}</span>`;
            feedbackElement.className = "correct-feedback";
            
            // Increment score
            score += 10;
            document.getElementById('score').textContent = score;
            
            // Move to next question after a short delay
            setTimeout(() => {
                moveToNextQuestion(true); // true means points were awarded
            }, 2000);
        } else {
            // Wrong answer
            optionButtons[selectedIndex].classList.add('wrong-option');
            optionButtons[mcq.answer].classList.add('correct-option');
            feedbackElement.innerHTML = `<span class="incorrect">Incorrect. The correct answer is ${String.fromCharCode(65 + mcq.answer)}. ${mcq.explanation}</span>`;
            feedbackElement.className = "incorrect-feedback";
            
            // Move to next question after a short delay
            setTimeout(() => {
                moveToNextQuestion(false); // false means no points were awarded
            }, 3000);
        }
    } catch (error) {
        console.error('Error checking MCQ answer:', error);
    }
}

function moveToNextQuestion(pointsAwarded) {
    currentQuestionIndex++;
    console.log('Moving to question:', currentQuestionIndex);
    
    if (currentQuestionIndex < questionSequence.length) {
        displayCurrentQuestion();
    } else {
        console.log('Quiz complete, showing end screen');
        endQuiz();
    }
}

// End the quiz and save score automatically
function endQuiz() {
    try {
        // Stop the timer
        const totalTime = stopTimer();
        
        hideAllSections();
        endEl.classList.remove('hide');
        
        if (finalScoreEl) finalScoreEl.innerText = score;
        if (finalTimeEl) finalTimeEl.innerText = formatTime(totalTime);
        
        // Automatically save the score with the pre-registered user data
        saveScore();
    } catch (error) {
        console.error('Error ending quiz:', error);
    }
}

// Save score automatically using pre-registered data
async function saveScore() {
    try {
        // Create score object
        const scoreData = {
            name: userData.name,
            rollno: userData.rollno,
            score: score,
            timeInSeconds: quizDuration,
            timeFormatted: formatTime(quizDuration),
            date: new Date().toISOString()
        };
        
        console.log('Saving score:', scoreData);
        
        // Save to database
        await saveScoreToDatabase(scoreData);
        console.log('Score saved successfully');
        
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Hide all sections
function hideAllSections() {
  try {
    // Use optional chaining to prevent errors if elements don't exist
    document.getElementById('home')?.classList.add('hide');
    document.getElementById('registration')?.classList.add('hide');
    document.getElementById('quiz-container')?.classList.add('hide');
    document.getElementById('end')?.classList.add('hide');
    document.getElementById('highscores')?.classList.add('hide');
  } catch (error) {
    console.error('Error hiding sections:', error);
  }
}

// Go to home screen
function goHome() {
    try {
        hideAllSections();
        homeEl.classList.remove('hide');
    } catch (error) {
        console.error('Error going home:', error);
    }
}

// Simple high score functions for now - we'll replace these with MongoDB later
function showHighscores() {
    try {
        hideAllSections();
        highscoresEl.classList.remove('hide');
        
        // Get high scores from database
        getScoresFromDatabase().then(highScores => {
            // Clear previous list
            highscoreListEl.innerHTML = '';
            
            // Create high score items
            highScores.forEach((score, index) => {
                const li = document.createElement('li');
                li.classList.add('highscore-item');
                li.innerHTML = `
                    <span class="highscore-name">${score.name}</span>
                    <span class="highscore-score">${score.score}</span>
                `;
                highscoreListEl.appendChild(li);
            });
            
            // Show message if no scores
            if (highScores.length === 0) {
                const li = document.createElement('li');
                li.classList.add('highscore-item');
                li.innerText = 'No high scores yet!';
                highscoreListEl.appendChild(li);
            }
        }).catch(error => {
            console.error('Error fetching highscores:', error);
        });
    } catch (error) {
        console.error('Error showing highscores:', error);
    }
}

// Clear high scores
function clearHighscores() {
    try {
        localStorage.removeItem('highScores');
        showHighscores();
    } catch (error) {
        console.error('Error clearing highscores:', error);
    }
}

// Export functions for use in other files
export { startMixedQuiz, showHighscores, showRegistration };
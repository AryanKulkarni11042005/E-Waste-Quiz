// Import necessary files
import riddles from './questions.js';

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
let quizContainerEl;
let highscoresEl;
let highscoreListEl;
let endEl;
let finalScoreEl;
let finalTimeEl;
let usernameEl;
let saveScoreBtn;

// Buttons
let startBtn;
let highscoreBtn;
let playAgainBtn;
let goHomeBtn;
let clearHighscoresBtn;
let returnHomeBtn;

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
        
        highscoreBtn = document.getElementById('highscore-btn');
        playAgainBtn = document.getElementById('play-again-btn');
        goHomeBtn = document.getElementById('go-home-btn');
        clearHighscoresBtn = document.getElementById('clear-highscores-btn');
        returnHomeBtn = document.getElementById('return-home-btn');

        // Add Event Listeners with direct callback for debugging
        console.log('Adding event listener to start button');
        if (startBtn) {
            startBtn.onclick = function() {
                console.log('Start button clicked!');
                startMixedQuiz();
            };
        }
        
        if (highscoreBtn) highscoreBtn.onclick = showHighscores;
        if (playAgainBtn) playAgainBtn.onclick = startMixedQuiz;
        if (goHomeBtn) goHomeBtn.onclick = goHome;
        if (clearHighscoresBtn) clearHighscoresBtn.onclick = clearHighscores;
        if (returnHomeBtn) returnHomeBtn.onclick = goHome;

        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
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

// End the quiz
function endQuiz() {
    try {
        // Stop the timer
        const totalTime = stopTimer();
        
        hideAllSections();
        endEl.classList.remove('hide');
        
        if (finalScoreEl) finalScoreEl.innerText = score;
        if (finalTimeEl) finalTimeEl.innerText = formatTime(totalTime);
    } catch (error) {
        console.error('Error ending quiz:', error);
    }
}

// Hide all sections
function hideAllSections() {
    try {
        homeEl.classList.add('hide');
        quizContainerEl.classList.add('hide');
        if (endEl) endEl.classList.add('hide');
        if (highscoresEl) highscoresEl.classList.add('hide');
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
        
        // Get high scores from localStorage
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        
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
export { startMixedQuiz, showHighscores };
import questions from './questions.js';
import { fadeIn, fadeOut, slideIn, slideOut, shakeElement } from './animations.js';

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Quiz initialized');
    setupEventListeners();
});

// DOM Elements
let homeEl;
let quizContainerEl;
let questionEl;
let choicesEl;
let questionCounterEl;
let scoreEl;
let progressFillEl;
let endEl;
let finalScoreEl;
let usernameEl;
let saveScoreBtn;
let highscoresEl;
let highscoreListEl;
let feedbackEl;
let feedbackIconEl;
let feedbackTextEl;

// Buttons
let startBtn;
let highscoreBtn;
let playAgainBtn;
let goHomeBtn;
let clearHighscoresBtn;
let returnHomeBtn;

// Quiz variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let currentQuestionIndex = 0;

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

function setupEventListeners() {
    // Get DOM Elements
    homeEl = document.getElementById('home');
    quizContainerEl = document.getElementById('quiz-container');
    questionEl = document.getElementById('question');
    choicesEl = document.getElementById('choices');
    questionCounterEl = document.getElementById('question-counter');
    scoreEl = document.getElementById('score');
    progressFillEl = document.getElementById('progress-fill');
    endEl = document.getElementById('end');
    finalScoreEl = document.getElementById('final-score');
    usernameEl = document.getElementById('username');
    saveScoreBtn = document.getElementById('save-score-btn');
    highscoresEl = document.getElementById('highscores');
    highscoreListEl = document.getElementById('highscore-list');
    feedbackEl = document.getElementById('feedback');
    feedbackIconEl = document.getElementById('feedback-icon');
    feedbackTextEl = document.getElementById('feedback-text');

    // Get buttons
    startBtn = document.getElementById('start-btn');
    highscoreBtn = document.getElementById('highscore-btn');
    playAgainBtn = document.getElementById('play-again-btn');
    goHomeBtn = document.getElementById('go-home-btn');
    clearHighscoresBtn = document.getElementById('clear-highscores-btn');
    returnHomeBtn = document.getElementById('return-home-btn');

    // Add Event Listeners
    startBtn.addEventListener('click', startGame);
    highscoreBtn.addEventListener('click', showHighscores);
    playAgainBtn.addEventListener('click', startGame);
    goHomeBtn.addEventListener('click', goHome);
    clearHighscoresBtn.addEventListener('click', clearHighscores);
    returnHomeBtn.addEventListener('click', goHome);

    // Enable/disable save score button based on username input
    usernameEl.addEventListener('keyup', () => {
        saveScoreBtn.disabled = !usernameEl.value;
    });

    // Save high score
    document.getElementById('username-form').addEventListener('submit', e => {
        e.preventDefault();
        saveHighScore();
    });
}

// Start the game
function startGame() {
    console.log('Starting game...');
    score = 0;
    questionCounter = 0;
    currentQuestionIndex = 0;
    availableQuestions = [...questions]; // Clone questions array
    hideAllSections();
    quizContainerEl.classList.remove('hide');
    getNewQuestion();
}

// Get a new question
function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        // End the game if no more questions or max reached
        endGame();
        return;
    }

    // Update question counter
    questionCounter++;
    questionCounterEl.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    
    // Update progress bar
    progressFillEl.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    
    // Get current question
    currentQuestionIndex = questionCounter - 1;
    currentQuestion = availableQuestions[currentQuestionIndex];
    
    // Display question
    questionEl.innerText = currentQuestion.question;
    
    // Clear previous choices
    choicesEl.innerHTML = '';
    
    // Create choice elements
    currentQuestion.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        choiceElement.classList.add('choice');
        choiceElement.dataset.number = index + 1;
        choiceElement.innerText = choice;
        
        // Add click event
        choiceElement.addEventListener('click', e => {
            if (!acceptingAnswers) return;
            
            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = parseInt(selectedChoice.dataset.number);
            
            // Check if answer is correct
            const isCorrect = selectedAnswer === currentQuestion.answer;
            
            // Update score if correct
            if (isCorrect) {
                incrementScore(CORRECT_BONUS);
            } else {
                shakeElement(selectedChoice);
            }
            
            // Apply classes for correct/incorrect
            const classToApply = isCorrect ? 'correct' : 'incorrect';
            selectedChoice.classList.add(classToApply);
            
            // Show feedback
            showFeedback(isCorrect, currentQuestion.explanation);
            
            // Move to next question after delay
            setTimeout(() => {
                selectedChoice.classList.remove(classToApply);
                feedbackEl.classList.add('hide');
                getNewQuestion();
                acceptingAnswers = true;
            }, 2000);
        });
        
        choicesEl.appendChild(choiceElement);
    });
    
    acceptingAnswers = true;
}

// Show feedback after answering
function showFeedback(isCorrect, explanation) {
    feedbackEl.classList.remove('hide');
    
    if (isCorrect) {
        feedbackIconEl.innerHTML = '<i class="fas fa-check-circle" style="color: var(--correct-color)"></i>';
        feedbackTextEl.innerHTML = `Correct! ${explanation}`;
    } else {
        feedbackIconEl.innerHTML = '<i class="fas fa-times-circle" style="color: var(--incorrect-color)"></i>';
        feedbackTextEl.innerHTML = `Incorrect. ${explanation}`;
    }
}

// Increment score
function incrementScore(num) {
    score += num;
    scoreEl.innerText = score;
}

// End the game
function endGame() {
    hideAllSections();
    endEl.classList.remove('hide');
    finalScoreEl.innerText = score;
}

// Save high score
function saveHighScore() {
    const username = usernameEl.value;
    
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // Add new score
    const newScore = {
        name: username,
        score: score,
        date: new Date().toLocaleDateString()
    };
    
    // Add to array, sort, and keep only top 5
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);
    
    // Save to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    // Show high scores
    showHighscores();
}

// Show high scores
function showHighscores() {
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
        li.style.animationDelay = `${index * 0.1}s`;
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
}

// Clear high scores
function clearHighscores() {
    localStorage.removeItem('highScores');
    showHighscores();
}

// Go to home screen
function goHome() {
    hideAllSections();
    homeEl.classList.remove('hide');
}

// Hide all sections
function hideAllSections() {
    homeEl.classList.add('hide');
    quizContainerEl.classList.add('hide');
    endEl.classList.add('hide');
    highscoresEl.classList.add('hide');
    feedbackEl.classList.add('hide');
}
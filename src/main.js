// Import styles
import './style.css';

// Import quiz functions from the quiz module
import * as Quiz from './scripts/quiz.js';

console.log('E-waste Riddles Challenge Loaded');

// Add direct event listener to start button as a backup
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in main.js');
  
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    console.log('Adding click listener to start button from main.js');
    startBtn.addEventListener('click', () => {
      console.log('Start button clicked from main.js');
      if (typeof Quiz.showRegistration === 'function') {
        Quiz.showRegistration();
      } else {
        console.error('showRegistration function not found');
        
        // Fallback approach
        document.getElementById('home')?.classList.add('hide');
        document.getElementById('registration')?.classList.remove('hide');
      }
    });
  } else {
    console.error('Start button not found in main.js');
  }
});
// Import styles
import './style.css';

// Direct import
import * as quiz from './scripts/quiz.js';

// Log application start
console.log('E-waste Riddles Challenge Loaded');

// Add any global configurations or initializations here
document.addEventListener('DOMContentLoaded', () => {
  // This will run after the DOM is fully loaded
  console.log('DOM fully loaded and parsed from main.js');
  
  // Directly add event listener to start button as a backup
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    console.log('Adding backup event listener to start button');
    startBtn.addEventListener('click', () => {
      console.log('Start button clicked in main.js');
      if (typeof quiz.startMixedQuiz === 'function') {
        console.log('Calling startMixedQuiz from main.js');
        quiz.startMixedQuiz();
      } else {
        console.error('startMixedQuiz function not found');
      }
    });
  } else {
    console.error('Start button not found in main.js');
  }
  
  // Add a simple loading indicator that disappears when the app is ready
  const body = document.querySelector('body');
  body.classList.add('app-loaded');
});

// Add service worker registration for PWA support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}
// Import styles
import './style.css';

// Import scripts
import './scripts/quiz.js';

// Log application start
console.log('E-waste Quiz Application Loaded');

// Add any global configurations or initializations here
document.addEventListener('DOMContentLoaded', () => {
  // This will run after the DOM is fully loaded
  console.log('DOM fully loaded and parsed');
  
  // You could add any global event listeners here if needed
  
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
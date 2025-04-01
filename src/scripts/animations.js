/**
 * Animation utility functions for the E-waste Quiz
 */

/**
 * Fade in animation for elements
 * @param {HTMLElement} element - The element to fade in
 * @param {number} duration - Animation duration in milliseconds
 */
export function fadeIn(element, duration = 500) {
  if (!element) return;
  
  element.style.opacity = 0;
  element.style.display = 'block';
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10);
}

/**
 * Fade out animation for elements
 * @param {HTMLElement} element - The element to fade out
 * @param {number} duration - Animation duration in milliseconds
 */
export function fadeOut(element, duration = 500) {
  if (!element) return;
  
  element.style.opacity = 1;
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = 'none';
  }, duration);
}

/**
 * Slide in animation for elements
 * @param {HTMLElement} element - The element to slide in
 * @param {string} direction - Direction of slide ('left', 'right', 'top', 'bottom')
 * @param {number} duration - Animation duration in milliseconds
 */
export function slideIn(element, direction = 'right', duration = 500) {
  if (!element) return;
  
  const directions = {
    left: 'translateX(-30px)',
    right: 'translateX(30px)',
    top: 'translateY(-30px)',
    bottom: 'translateY(30px)',
  };
  
  element.style.opacity = 0;
  element.style.transform = directions[direction] || directions.right;
  element.style.display = 'block';
  element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;
  
  setTimeout(() => {
    element.style.opacity = 1;
    element.style.transform = 'translate(0, 0)';
  }, 10);
}

/**
 * Slide out animation for elements
 * @param {HTMLElement} element - The element to slide out
 * @param {string} direction - Direction of slide ('left', 'right', 'top', 'bottom')
 * @param {number} duration - Animation duration in milliseconds
 */
export function slideOut(element, direction = 'left', duration = 500) {
  if (!element) return;
  
  const directions = {
    left: 'translateX(-30px)',
    right: 'translateX(30px)',
    top: 'translateY(-30px)',
    bottom: 'translateY(30px)',
  };
  
  element.style.opacity = 1;
  element.style.transform = 'translate(0, 0)';
  element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;
  
  setTimeout(() => {
    element.style.opacity = 0;
    element.style.transform = directions[direction] || directions.left;
    
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  }, 10);
}

/**
 * Apply shake animation to an element
 * @param {HTMLElement} element - The element to shake
 */
export function shakeElement(element) {
  if (!element) return;
  
  // Add CSS if it doesn't exist
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      .shake-animation {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
    `;
    document.head.appendChild(style);
  }
  
  element.classList.add('shake-animation');
  
  element.addEventListener('animationend', function removeShake() {
    element.classList.remove('shake-animation');
    element.removeEventListener('animationend', removeShake);
  });
}
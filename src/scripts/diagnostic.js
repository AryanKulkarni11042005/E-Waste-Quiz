// Diagnostic script to help debug quiz start issues

document.addEventListener('DOMContentLoaded', () => {
    console.log('Diagnostic script loaded');
    
    // Check if elements exist
    const startBtn = document.getElementById('start-btn');
    console.log('Start button exists:', !!startBtn);
    
    // Add a manual trigger for starting the quiz
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Start button clicked in diagnostic script');
        });
    }
    
    // Add a debug button
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug Start Quiz';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '10px';
    debugBtn.style.right = '10px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.padding = '8px 16px';
    debugBtn.style.background = '#ff9800';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '4px';
    debugBtn.style.color = 'white';
    debugBtn.style.cursor = 'pointer';
    
    document.body.appendChild(debugBtn);
    
    debugBtn.addEventListener('click', () => {
        console.log('Debug button clicked - trying to manually start quiz');
        
        // Try to directly access and display quiz container
        const homeEl = document.getElementById('home');
        const quizContainerEl = document.getElementById('quiz-container');
        
        if (homeEl && quizContainerEl) {
            console.log('Found home and quiz container elements');
            homeEl.classList.add('hide');
            quizContainerEl.classList.remove('hide');
            
            // Create a basic question
            quizContainerEl.innerHTML = `
                <div id="quiz-header">
                    <div class="hud">
                        <div class="hud-item">
                            <p class="hud-prefix">Question</p>
                            <h2 id="question-counter">1/10</h2>
                        </div>
                        <div class="hud-item">
                            <p class="hud-prefix">Score</p>
                            <h2 id="score">0</h2>
                        </div>
                        <div class="hud-item">
                            <p class="hud-prefix">Time</p>
                            <h2 id="timer">00:00</h2>
                        </div>
                    </div>
                </div>
                <h2>Debug Question</h2>
                <p>This is a debug question to test if the quiz container is working properly.</p>
            `;
        } else {
            console.error('Could not find home or quiz container elements');
        }
    });
});
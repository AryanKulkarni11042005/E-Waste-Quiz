// Simplified database module for initial testing
// We'll implement full MongoDB functionality once the quiz works

// Save score locally for now
export function saveScoreToDatabase(scoreData) {
  try {
    console.log('Score would be saved to MongoDB:', scoreData);
    
    // Save to local storage as fallback
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(scoreData);
    highScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; 
      }
      return a.timeInSeconds - b.timeInSeconds;
    });
    highScores.splice(10);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    return Promise.resolve({ success: true, message: 'Score saved locally' });
  } catch (error) {
    console.error('Error saving score:', error);
    return Promise.reject(error);
  }
}

// Get scores from local storage for now
export function getScoresFromDatabase() {
  try {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    return Promise.resolve(highScores);
  } catch (error) {
    console.error('Error retrieving scores:', error);
    return Promise.reject(error);
  }
}
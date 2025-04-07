// MongoDB integration through API endpoints (Vercel serverless functions)

// Use relative path for API calls (works both in dev and production)
const API_URL = '/api';

// Save score to database via API
export async function saveScoreToDatabase(scoreData) {
  try {
    console.log('Saving score to MongoDB:', scoreData);
    
    // Validate required data
    if (!scoreData.name || !scoreData.rollno) {
      console.error('Missing required user data');
      throw new Error('Missing required user data');
    }
    
    // Try to save to the API
    const response = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Score saved to MongoDB successfully:', result);
    
    // Always save locally as a backup
    saveScoreLocally(scoreData);
    
    return result;
  } catch (error) {
    console.error('Error saving score to MongoDB:', error);
    
    // Save locally as fallback
    console.log('Saving score locally as fallback');
    saveScoreLocally(scoreData);
    
    return {
      success: true,
      message: 'Score saved locally (MongoDB unavailable)',
      local: true
    };
  }
}

// Get scores from database via API
export async function getScoresFromDatabase() {
  try {
    console.log('Fetching scores from MongoDB');
    
    const response = await fetch(`${API_URL}/scores`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const scores = await response.json();
    console.log(`Retrieved ${scores.length} scores from MongoDB`);
    
    return scores;
  } catch (error) {
    console.error('Error fetching scores from MongoDB:', error);
    
    // Fall back to local storage
    console.log('Falling back to local scores');
    return getScoresLocally();
  }
}

// Get top scores for each student
export async function getTopScores() {
  try {
    console.log('Fetching top scores from MongoDB');
    
    const response = await fetch(`${API_URL}/scores-top`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const scores = await response.json();
    console.log(`Retrieved ${scores.length} top scores`);
    
    return scores;
  } catch (error) {
    console.error('Error fetching top scores:', error);
    // Fall back to local storage
    return getScoresLocally();
  }
}

// Get scores for a specific student by roll number
export async function getStudentScores(rollno) {
  try {
    console.log(`Fetching scores for student ${rollno}`);
    
    const response = await fetch(`${API_URL}/scores-student?rollno=${encodeURIComponent(rollno)}`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const scores = await response.json();
    console.log(`Retrieved ${scores.length} scores for student ${rollno}`);
    
    return scores;
  } catch (error) {
    console.error(`Error fetching scores for student ${rollno}:`, error);
    
    // Fall back to filtering local scores for this student
    const allScores = getScoresLocally();
    return allScores.filter(score => score.rollno === rollno);
  }
}

// Helper function to save score locally
function saveScoreLocally(scoreData) {
  try {
    // Get existing scores from localStorage
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // Add the score with user data
    highScores.push({
      ...scoreData,
      timestamp: new Date().toISOString() // Add timestamp
    });
    
    // Sort by score (desc) then time (asc)
    highScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; 
      }
      return a.timeInSeconds - b.timeInSeconds;
    });
    
    // Keep only top 50 scores
    highScores.splice(50);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    
    return true;
  } catch (error) {
    console.error('Error saving score locally:', error);
    return false;
  }
}

// Helper function to get scores from local storage
function getScoresLocally() {
  try {
    return JSON.parse(localStorage.getItem('highScores')) || [];
  } catch (error) {
    console.error('Error retrieving local scores:', error);
    return [];
  }
}
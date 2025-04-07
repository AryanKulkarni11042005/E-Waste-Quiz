const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection('quiz_scores');
    
    // Get top score for each student using MongoDB aggregation
    const topScores = await collection.aggregate([
      // Sort all scores
      { $sort: { score: -1, timeInSeconds: 1 } },
      // Group by rollno and keep only the first (highest) score
      { $group: {
          _id: "$rollno",
          name: { $first: "$name" },
          rollno: { $first: "$rollno" },
          score: { $first: "$score" },
          timeInSeconds: { $first: "$timeInSeconds" },
          timeFormatted: { $first: "$timeFormatted" },
          timestamp: { $first: "$timestamp" }
        }
      },
      // Sort the resulting top scores
      { $sort: { score: -1, timeInSeconds: 1 } }
    ]).toArray();
    
    res.status(200).json(topScores);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
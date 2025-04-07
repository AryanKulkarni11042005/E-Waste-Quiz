const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection('quiz_scores');
    
    if (req.method === 'GET') {
      // Get all scores, sorted by score (desc) and time (asc)
      const scores = await collection
        .find({})
        .sort({ score: -1, timeInSeconds: 1 })
        .limit(50)
        .toArray();
      
      res.status(200).json(scores);
    } 
    else if (req.method === 'POST') {
      // Save a score
      const scoreData = req.body;
      
      // Validate required data
      if (!scoreData.name || !scoreData.rollno) {
        return res.status(400).json({ error: 'Missing required user data (name or rollno)' });
      }
      
      // Add timestamp
      scoreData.timestamp = new Date();
      
      const result = await collection.insertOne(scoreData);
      
      res.status(201).json({
        success: true,
        message: 'Score saved successfully',
        id: result.insertedId
      });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
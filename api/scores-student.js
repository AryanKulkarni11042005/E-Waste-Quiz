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
    // Get rollno from query parameter
    const { rollno } = req.query;
    
    if (!rollno) {
      return res.status(400).json({ error: 'Roll number is required' });
    }
    
    const db = await connectToDatabase();
    const collection = db.collection('quiz_scores');
    
    // Get all scores for this student
    const scores = await collection
      .find({ rollno })
      .sort({ timestamp: -1 })
      .toArray();
    
    res.status(200).json(scores);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
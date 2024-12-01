import Scores from '../models/Scores.js'


export const getAllScores = async (req, res) => {
    try {
      const scores = await Scores.find(); // Fetch all accounts from the database
      res.status(200).json(scores); // Send the accounts as JSON response
    } catch (err) {
      console.error('Error fetching accounts:', err.message);
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  }
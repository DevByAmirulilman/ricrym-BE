import Account from "../models/Account.js";

export const getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find()
      .populate({
        path: 'characters.character', // Populate the `character` field in `characters`
        model:'Character',
      })
      .populate({
        path: 'characters.score', // Populate the `score` field in `characters`
        model: 'Score',
      });

      res.status(200).json(accounts); // Send the accounts as JSON response
    } catch (err) {
      console.error('Error fetching accounts:', err.message);
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  }

export const getAccountById = async (req, res) => {
  const { accountId } = req.params
  try {
    const accounts = await Account.findById(accountId)
    .populate({
      path: 'characters.character', // Populate the `character` field in `characters`
      model:'Character',
    })
    .populate({
      path: 'characters.score', // Populate the `score` field in `characters`
      model: 'Score',
    });

    res.status(200).json(accounts); // Send the accounts as JSON response
  } catch (err) {
    console.error('Error fetching accounts:', err.message);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
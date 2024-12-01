import Character from "../models/Character.js";

export const getAllCharacters = async (req, res) => {
    try {
      const characters = await Character.find(); // Fetch all accounts from the database
      res.status(200).json(characters); // Send the accounts as JSON response
    } catch (err) {
      console.error('Error fetching accounts:', err.message);
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  }

  export const getCharacterById = async (req, res) => {
    const { characterId } = req.params; // Get `characterId` from route parameters
  
    try {
      // Fetch the character by its ID and populate the associated account
      const character = await Character.findById(characterId).populate('Account', 'username email'); // Populate account with specific fields
  
      if (!character) {
        return res.status(404).json({ error: 'No character found for the given character ID' });
      }
  
      res.status(200).json(character); // Send the character as a JSON response
    } catch (err) {
      console.error('Error fetching character:', err.message);
      res.status(500).json({ error: 'Failed to fetch character' });
    }
  };
  
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Scores from './models/Scores.js';
import Character from './models/Character.js';
import Account from './models/Account.js';
import connectToDatabase from './config/db.js';

const seedScores = async () => {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    // Fetch all accounts with their characters
    const accounts = await Account.find().populate('characters.character_id');
    if (accounts.length === 0) {
      console.error('No accounts found. Seed accounts and characters first.');
      process.exit(1);
    }

    for (const account of accounts) {
      for (const charObj of account.characters) {
        const character = charObj.character_id; // Get the character document
        if (character) {
          // Create a score for this character
          const score = await Scores.create({
            char_id: character._id,
            reward_score: faker.number.int({ min: 0, max: 100 }), // Generate a random score
          });

          // Add the score to the character's scores array in the account
          charObj.scores.push(score._id);
          await character.save();
        }
      }

      // Save the updated account
      await account.save();
      console.log(`Scores assigned to account ${account.username}`);
    }

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error seeding scores:', err.message);
    process.exit(1); // Exit with failure
  }
};

// Run the seeding function
seedScores();

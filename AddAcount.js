import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Account from './models/Account.js'; // Import the Account model
import connectToDatabase from './config/db.js'; // Import the database connection
import Character from './models/Character.js';
import Scores from './models/Scores.js';
import speakeasy from 'speakeasy';

dotenv.config(); // Load environment variables

const AddAccount = async () => {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    // Fetch existing characters
    const characters = await Character.find();
    if (characters.length === 0) {
      console.error('No characters found in the database. Seed characters first.');
      return;
    }

    // Number of salt rounds for bcrypt
    const saltRounds = 10;

    // Generate random scores for each character
    const randomCharacters = await Promise.all(
      characters.map(async (char) => {
        const score = await Scores.create({
          char_id: char._id,
          reward_score: faker.number.int({ min: 0, max: 100 }), // Generate a random score
        });
        return {
          character: char._id,
          score: score._id,
        };
      })
    );

    // Hash a fixed password
    const plainPassword = 'aabbccdd'; // Define a fixed password for testing
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Generate a new 2FA secret
    const secret = speakeasy.generateSecret({
      name: `WiraApp (kamarul@gmail.com)`, // App name and user email
    });

    // Create a single account
    const account = await Account.create({
      username: 'kamarul', // Define a fixed username
      email: 'kamarul@gmail.com', // Define a fixed email
      password: hashedPassword, // Store the hashed password
      avatar: {
        url: faker.image.avatar(), // URL for avatar
      },
      characters: randomCharacters, // Add characters with their scores
      twoFactorSecret: secret.base32, // Save the generated 2FA secret
    });

    console.log('Account added successfully:', account);
    console.log(`Generated password for user: ${plainPassword}`);
    console.log(`Generated 2FA Secret: ${secret.base32}`);
    console.log(`2FA OTPAuth URL: ${secret.otpauth_url}`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error adding account:', err.message);
    process.exit(1); // Exit with failure
  }
};

// Run the script
AddAccount();

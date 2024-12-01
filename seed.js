import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import Account from './models/Account.js'; // Import the Account model
import connectToDatabase from './config/db.js'; // Import the database connection
import Character from './models/Character.js';
import Scores from './models/Scores.js';

dotenv.config(); // Load environment variables

const seedAccounts = async () => {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to MongoDB. Seeding data...');

    // Clear existing accounts (optional)
    await Account.deleteMany();
    console.log('Existing accounts deleted.');

    // Fetch existing characters
    const characters = await Character.find();
    if (characters.length === 0) {
      console.error('No characters found in the database. Seed characters first.');
      return;
    }

    // Number of salt rounds for bcrypt
    const saltRounds = 10;

    // Generate fake accounts
    const fakeAccounts = [];
    for (let i = 0; i < 30; i++) {
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

      // Hash a random password
      const plainPassword = faker.internet.password(); // Generate a random password
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      // Create a fake account
      fakeAccounts.push({
        username: faker.internet.username(), // Generate a random username
        email: faker.internet.email(), // Generate a random email
        password: hashedPassword, // Store the hashed password
        avatar: {
          url: faker.image.avatar(), // URL for avatar
        },
        characters: randomCharacters, // Add characters with their scores
      });
      console.log(plainPassword)

    }

    // Insert accounts into the database
    await Account.insertMany(fakeAccounts);
    console.log('Fake accounts added successfully:', fakeAccounts.length);

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error seeding accounts:', err.message);
    process.exit(1); // Exit with failure
  }
};

// Run the seed script
seedAccounts();

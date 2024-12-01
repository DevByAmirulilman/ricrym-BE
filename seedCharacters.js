import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectToDatabase from './config/db.js'; // Import the database connection
import Character from './models/Character.js';
import Account from './models/Account.js'; // Ensure Account model is defined

dotenv.config();

const CLASS_TYPES = [
  { id: 1, name: "Warrior" },
  { id: 2, name: "Mage" },
  { id: 3, name: "Archer" },
  { id: 4, name: "Healer" },
];


const seedCharacters = async () => {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    // Clear existing accounts (optional)
    await Character.deleteMany();
    console.log('Existing accounts deleted.');

    // Generate Characters
    const characters = CLASS_TYPES.map(({ id, name }) => ({
      class_id: id,
      class_name: name, // Include class name
    }));

    // Insert Characters
    await Character.insertMany(characters);
    console.log('Characters seeded successfully:', characters.length);

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error seeding characters:', err.message);
    process.exit(1);
  }
};

seedCharacters();

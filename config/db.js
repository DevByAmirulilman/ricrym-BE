
import mongoose from 'mongoose';

const connectToDatabase = async () => {
    const uri = 'mongodb+srv://ecommerce2024:aJQ28aixOGf1KzaU@ecomm22.3jcqi.mongodb.net/?retryWrites=true&w=majority&appName=ecomm22';
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit on failure
  }
};

export default connectToDatabase;

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CLASS_TYPES = {
  WARRIOR: 1,
  MAGE: 2,
  ARCHER: 3,
  HEALER: 4,
};

const CharacterSchema = new Schema(
  {
    class_id: { 
      type: Number, 
      required: true,
      enum: Object.values(CLASS_TYPES), // Validate against predefined constants
    },
    class_name: { 
      type: String, 
      required: true,
    },
  }, 
  { timestamps: true }
);


const Character = model('Character', CharacterSchema);

export default Character;

// SessionSchema.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SessionSchema = new Schema(
  {
    session_id: { type: String, required: true, unique: true }, // Unique session ID
    session_metadata: { type: Object, required: true }, // Metadata for session
    expiry_datetime: { type: Date, required: true }, // Session expiry
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Session = model('Session', SessionSchema);

export default Session; // Ensure a default export

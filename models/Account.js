import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role : {
    type:Number,
    default:0
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false },
    url: { type: String, required: false },
  },
  twoFactorSecret: { type: String, required: false }, // Store the secret key for 2FA
  isTwoFactorEnabled: { type: Boolean, default: false }, // Flag to enable/disable 2FA
  characters: [
  {
    character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required : false},
    score: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' , required : false},
  }
  ],
  totalScore : {
    type: Number,
    required : false
  }
});

const Account = mongoose.model('Account', AccountSchema);

export default Account;

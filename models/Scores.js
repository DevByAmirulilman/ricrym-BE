import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ScoreSchema = new Schema(
{
    char_id : {
      type: Schema.Types.ObjectId, 
      ref: 'Character', // Reference to Account model
      required: true 
    },
    reward_score : {
        type: Number,
        required : true
    }
}
)

const Scores = model('Score',ScoreSchema)

export default Scores
import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const JoinedPlayerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  authId: { type: String, required: true, trim: true },
  userName: { type: String, required: true, trim: true },
  kills: { type: Number, default: 0 },
  winning: { type: Number, default: 0 },
});

const ResultMatchesSchema = new mongoose.Schema(
  {
    myMatchId: { type: String, unique: true, required: true },
    title: { type: String, required: true, trim: true },
    matchType: { type: String, required: true, trim: true },
    winPrize: { type: Number, required: true },
    perKill: { type: Number, required: true },
    entryFee: { type: Number, required: true },
    entryType: { type: String, required: true, trim: true },
    map: { type: String, required: true, trim: true },
    prizeDetails: { type: Array, default: [] },
    startTime: { type: Date, required: true },
    joinedPlayers: { type: [JoinedPlayerSchema], default: [] },
  },
  { timestamps: true },
);

// ✅ Prevent duplicate plugin registration
let ResultMatches;

if (mongoose.models.ResultMatches) {
  ResultMatches = mongoose.models.ResultMatches;
} else {
  ResultMatches = mongoose.model("ResultMatches", ResultMatchesSchema);
}

export default ResultMatches;

import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.Mixed, // supports string | string[] | object
      required: true,
    },
    answer: {
      type: mongoose.Schema.Types.Mixed, // same flexibility
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", CardSchema);
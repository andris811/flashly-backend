import express from "express";
import { verifyToken } from "../middleware/auth";
import Deck from "../models/Deck";
import Card from "../models/Card";

const router = express.Router();

// Get all decks for the logged-in user
router.get("/", verifyToken, async (req: any, res) => {
  try {
    const decks = await Deck.find({ userId: req.userId });
    res.status(200).json(decks);
  } catch (err) {
    console.error("Get decks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new deck
router.post("/", verifyToken, async (req: any, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Deck name required" });

  try {
    const newDeck = await Deck.create({ name, userId: req.userId });
    res.status(201).json(newDeck);
  } catch (err) {
    console.error("Create deck error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a card to a deck
router.post("/:deckId/cards", verifyToken, async (req: any, res) => {
  const { deckId } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer)
    return res.status(400).json({ message: "Missing question or answer" });

  try {
    const deck = await Deck.findOne({ _id: deckId, userId: req.userId });
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const newCard = await Card.create({ deckId, question, answer });
    res.status(201).json(newCard);
  } catch (err) {
    console.error("Add card error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all cards in a deck
router.get("/:deckId/cards", verifyToken, async (req: any, res) => {
  try {
    const deck = await Deck.findOne({
      _id: req.params.deckId,
      userId: req.userId,
    });
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const cards = await Card.find({ deckId: deck._id });
    res.status(200).json(cards);
  } catch (err) {
    console.error("Get cards error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a deck (and its cards)
router.delete("/:deckId", verifyToken, async (req: any, res) => {
  try {
    const deck = await Deck.findOneAndDelete({
      _id: req.params.deckId,
      userId: req.userId,
    });

    if (!deck) return res.status(404).json({ message: "Deck not found" });

    await Card.deleteMany({ deckId: req.params.deckId });

    res.status(200).json({ message: "Deck and cards deleted" });
  } catch (err) {
    console.error("Delete deck error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
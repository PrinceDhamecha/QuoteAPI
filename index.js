const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/quotesAPI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Mongoose Schema and Model
const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
});

const Quote = mongoose.model("Quote", quoteSchema);


// Endpoints
// 1. Fetch All Quotes
app.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching quotes" });
  }
});

// 2. Fetch a Random Quote
app.get("/quote/random", async (req, res) => {
  try {
    const quotes = await Quote.find();
    if (quotes.length === 0) {
      return res.status(404).json({ error: "No quotes found" });
    }
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  } catch (err) {
    res.status(500).json({ error: "Error fetching random quote" });
  }
});

// 3. Add a New Quote
app.post("/quote", async (req, res) => {
  const { text, author } = req.body;
  try {
    const newQuote = new Quote({ text, author });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(400).json({ error: "Error adding quote" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Quote API is running at http://localhost:${port}`);
});

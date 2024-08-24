const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to DB.");
    })
    .catch((err) => {
        console.log("error connecting to DB", err);
    });

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number
})

const Score = mongoose.model('Score', scoreSchema);

app.post('/submit-score', async (req, res) => {
    try {
        const { name, score } = req.body;

        if (!name || !score) {
            return res.status(400).json({ error: "Name is required" });
        }

        let leaderboard = await Score.find().sort({ score: -1 }).limit(10);

        await Score.create({ name, score });
        leaderboard = await Score.find().sort({ score: -1 }).limit(10);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.get('/leaderboard', async (req, res) => {
    const leaderboard = await Score.find().sort({ score: -1 }).limit(10);
    res.send(leaderboard);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on *${PORT}`);
})


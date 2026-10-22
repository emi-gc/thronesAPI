import express from 'express';
import { getCatalog, getCharacter } from "./services/gotService.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Serve the static frontend from ./public
app.use(express.static('public'));

app.get("/api/characters", async (requestAnimationFrame, res) => {
  try {
    const characters = await getCatalog(requestAnimationFrame.query.name || "");
    if (characters.length===0) {
      return res.status(404).json({
        message: "No characters found."
      });
    }
    res.json(characters);
  }
  catch (error) {
    console.error(error.message);

    res.status(502).json({
      message: "Could not load the catalog."
    });
  }
});

app.get("/api/character", async (req, res) => {
  try {
    const character = await getCharacter(req.query.id);

    if (!character){
      return res.status(404).json({
        message: "Character not found."
      });
    }
    res.json(character);
  } catch (error) {
    console.error(error.message);

    res.status(502).json({
      message: "Could not load character."
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
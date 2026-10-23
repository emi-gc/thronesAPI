import express from 'express';
import { getCatalog, getCharacterByIdOrSearch } from "./services/gotService.js";

const app = express();
const PORT = process.env.PORT || 5501;

// Serve the static frontend from ./public
app.use(express.static('public'));

app.get("/api/characters", async (req, res) => {
  try {
    const characters = await getCatalog(req.query.name || "");
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
    const character = await getCharacterByIdOrSearch(req.query.id || req.query.name);

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
import express from 'express';
import {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  getGamesCount
} from '../controller/gameController.js';

const router = express.Router();

// Create a new game
router.post('/', createGame);

// Get all games
router.get('/', getGames);
router.get('/count', getGamesCount);
// Get game by ID
router.get('/:id', getGameById);

// Update game
router.put('/:id', updateGame);

// Delete game
router.delete('/:id', deleteGame);



export default router;

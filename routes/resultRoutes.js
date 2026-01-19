import express from 'express';
import {
  createResult,
  getResults,
  getResultById,
  getResultsByGame,
  updateResult,
  deleteResult,
   getActiveGamesWithTodayResults,
   getPreviousGameResults,
   getTodayLuckyNumbers
} from '../controller/resultController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new result
router.post('/', authMiddleware, createResult);

// Get all results
router.get('/', getResults);

// Get today's results
router.get(
  "/active-games-today",
  getActiveGamesWithTodayResults
);
router.get("/today", getTodayLuckyNumbers);
// Get result by ID
router.get('/:id', getResultById);


// Get results by game
router.get('/game/:gameId', getResultsByGame);

router.get("/previous-results/:gameId", getPreviousGameResults);

// Update result
router.put('/:id', updateResult);

// Delete result
router.delete('/:id', deleteResult);



export default router;

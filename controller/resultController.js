import Result from '../models/Result.js';
import Game from '../models/Game.js';

import mongoose from 'mongoose';
import { calculateResult } from '../utils/calculateResult.js';

// Create a new result
export const createResult = async (req, res) => {
  try {
    const { game, date, roundType, totalArrowsShot, totalHits, directNumber } = req.body;
    const declaredBy = req.user.id;

    // Check if game exists
    const gameExists = await Game.findById(game);
    if (!gameExists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // User is already authenticated via authMiddleware, so no need to check again

    // Calculate result number
    const resultNumber = calculateResult(totalHits);

    // Ensure directNumber is an array if provided
    let directNumberArray = null;
    if (directNumber) {
      if (Array.isArray(directNumber)) {
        directNumberArray = directNumber;
      } else if (typeof directNumber === 'string') {
        directNumberArray = directNumber.split(',').map(s => s.trim());
      } else {
        return res.status(400).json({ message: 'directNumber must be an array or comma-separated string' });
      }
    }

    const result = new Result({
      game: new mongoose.Types.ObjectId(game),
      date: new Date(date),
      roundType,
      totalArrowsShot,
      totalHits,
      resultNumber,
      directNumber: directNumberArray,
      declaredBy: new mongoose.Types.ObjectId(declaredBy)
    });

    await result.save();

    res.status(201).json({
      message: 'Result created successfully',
      result: {
        id: result._id,
        game: result.game,
        date: result.date,
        roundType: result.roundType,
        totalArrowsShot: result.totalArrowsShot,
        totalHits: result.totalHits,
        resultNumber: result.resultNumber,
        directNumber: result.directNumber,
        declaredBy: result.declaredBy,
        declaredAt: result.declaredAt
      }
    });
  } catch (error) {
    console.error('Error creating result:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Result already exists for this game, date, and round' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all results
export const getResults = async (req, res) => {
  try {
    const results = await Result.find({}).populate('game', 'name').populate('declaredBy', 'name');
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get result by ID
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('game', 'name').populate('declaredBy', 'name');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get results by game
export const getResultsByGame = async (req, res) => {
  try {
    const results = await Result.find({ game: req.params.gameId }).populate('game', 'name').populate('declaredBy', 'name');
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update result
export const updateResult = async (req, res) => {
  try {
    const { totalArrowsShot, totalHits, declaredBy, directNumber } = req.body;

    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (totalHits !== undefined) {
      result.totalHits = totalHits;
      result.resultNumber = calculateResult(totalHits);
    }

    result.totalArrowsShot = totalArrowsShot || result.totalArrowsShot;
    result.declaredBy = declaredBy || result.declaredBy;

    // Handle directNumber update
    if (directNumber !== undefined) {
      let directNumberArray = null;
      if (directNumber) {
        if (Array.isArray(directNumber)) {
          directNumberArray = directNumber;
        } else if (typeof directNumber === 'string') {
          directNumberArray = directNumber.split(',').map(s => s.trim());
        } else {
          return res.status(400).json({ message: 'directNumber must be an array or comma-separated string' });
        }
      }
      result.directNumber = directNumberArray;
    }

    await result.save();

    res.json({
      message: 'Result updated successfully',
      result: {
        id: result._id,
        game: result.game,
        date: result.date,
        roundType: result.roundType,
        totalArrowsShot: result.totalArrowsShot,
        totalHits: result.totalHits,
        resultNumber: result.resultNumber,
        directNumber: result.directNumber,
        declaredBy: result.declaredBy,
        declaredAt: result.declaredAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    await result.remove();

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's results
export const getActiveGamesWithTodayResults = async (req, res) => {
  try {
    // ===== TODAY RANGE (LOCAL TIME SAFE) =====
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );

    // ===== FETCH ACTIVE GAMES =====
    const games = await Game.find({ isActive: true })
      .select("name description isActive")
      .lean();

    // 🚨 If this logs empty, your game is NOT active
    console.log("ACTIVE GAMES:", games);

    // ===== FETCH TODAY RESULTS =====
    const results = await Result.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    }).lean();

    // ===== MAP RESULTS BY GAME =====
    const resultMap = {};

    for (const r of results) {
      const gameId = r.game.toString(); // 🔥 VERY IMPORTANT

      if (!resultMap[gameId]) {
        resultMap[gameId] = { FR: null, SR: null };
      }

      if (r.roundType === "FR") resultMap[gameId].FR = r;
      if (r.roundType === "SR") resultMap[gameId].SR = r;
    }

    // ===== MERGE GAMES + RESULTS (NO FILTERING) =====
    const response = games.map(game => {
      const gid = game._id.toString();

      return {
        gameId: gid,
        gameName: game.name,
        description: game.description || "",
        FR: resultMap[gid]?.FR || null,
        SR: resultMap[gid]?.SR || null
      };
    });

    res.json({ results: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
export const getPreviousGameResults = async (req, res) => {
  try {
    const { gameId } = req.params; // optional (for specific game)

    const query = {};
    if (gameId) {
      query.game = gameId;
    }

    const results = await Result.find(query)
      .populate("game", "name")
      .sort({ date: -1, declaredAt: 1 }) // newest date first
      .lean();

    /**
     * STRUCTURE:
     * {
     *   gameId: {
     *     gameName,
     *     rows: {
     *       date: { FR, SR }
     *     }
     *   }
     * }
     */
    const grouped = {};

    for (const r of results) {
      const gid = r.game._id.toString();
      const dateKey = r.date.toISOString().split("T")[0];

      if (!grouped[gid]) {
        grouped[gid] = {
          gameId: gid,
          gameName: r.game.name,
          rows: {}
        };
      }

      if (!grouped[gid].rows[dateKey]) {
        grouped[gid].rows[dateKey] = {
          date: dateKey,
          FR: null,
          SR: null
        };
      }

      if (r.roundType === "FR") {
        grouped[gid].rows[dateKey].FR = r.resultNumber;
      }

      if (r.roundType === "SR") {
        grouped[gid].rows[dateKey].SR = r.resultNumber;
      }
    }

    // Convert rows object → array
    const response = Object.values(grouped).map(game => ({
      gameId: game.gameId,
      gameName: game.gameName,
      results: Object.values(game.rows)
    }));

    res.json({ results: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getTodayLuckyNumbers = async (req, res) => {
  try {
    const DAYS = 20;
    const LIMIT = 5;

    // 🔹 FIX today date (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔹 history start date (today - 20 days)
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() - DAYS);

    // 🔹 get active games
    const games = await Game.find({ isActive: true });

    const results = [];

    for (const game of games) {
      // ✅ ONLY past results (not today)
      const history = await Result.find({
        game: game._id,
        date: { $gte: fromDate, $lt: today },
      }).select("resultNumber");

      const freq = {};

      history.forEach(r => {
        freq[r.resultNumber] = (freq[r.resultNumber] || 0) + 1;
      });

      const luckyNumbers = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, LIMIT)
        .map(([num]) => num);

      results.push({
        gameId: game._id,
        gameName: game.name,
        luckyNumbers,
      });
    }

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
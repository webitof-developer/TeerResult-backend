import Game from '../models/Game.js';

// Create a new game
export const createGame = async (req, res) => {
  try {
    const { name, location, description, isActive } = req.body;

    const game = new Game({
      name,
      location,
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    await game.save();

    res.status(201).json({
      message: 'Game created successfully',
      game: {
        id: game._id,
        name: game.name,
        location: game.location,
        description: game.description,
        isActive: game.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all games
export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get game by ID
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update game
export const updateGame = async (req, res) => {
  try {
    const { name, location, isActive, description } = req.body;

    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.name = name || game.name;
    game.location = location || game.location;
    game.isActive = isActive !== undefined ? isActive : game.isActive;
    game.description = description || game.description;

    await game.save();

    res.json({
      message: 'Game updated successfully',
      game: {
        id: game._id,
        name: game.name,
        location: game.location,
        isActive: game.isActive,
        description: game.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete game
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.deleteOne();

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get total count of games
export const getGamesCount = async (req, res) => {
  try {
    const count = await Game.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

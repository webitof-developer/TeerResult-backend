import DreamNumber from "../models/DreamNumber.js";

// Get all dream numbers
export const getDreamNumbers = async (req, res) => {
  try {
    const dreams = await DreamNumber.find();

    const results = dreams.map(d => {
      const houses = [...new Set(d.numbers.map(n => n[0]))];
      const endings = [...new Set(d.numbers.map(n => n[1]))];

      return {
        _id: d._id,
        dream: d.dream,
        numbers: d.numbers,
        house: houses,
        ending: endings,
      };
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get dream number by ID
export const getDreamNumberById = async (req, res) => {
  try {
    const dream = await DreamNumber.findById(req.params.id);
    if (!dream) {
      return res.status(404).json({ message: "Dream number not found" });
    }

    const houses = [...new Set(dream.numbers.map(n => n[0]))];
    const endings = [...new Set(dream.numbers.map(n => n[1]))];

    res.json({
      result: {
        id: dream._id,
        dream: dream.dream,
        numbers: dream.numbers,
        house: houses,
        ending: endings,
        createdAt: dream.createdAt,
        updatedAt: dream.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new dream number
export const createDreamNumber = async (req, res) => {
  try {
    const { dream, numbers } = req.body;

    if (!dream || !numbers) {
      return res.status(400).json({ message: "Dream and numbers are required" });
    }

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ message: "Numbers must be a non-empty array" });
    }

    const newDream = new DreamNumber({
      dream,
      numbers
    });

    await newDream.save();

    const houses = [...new Set(numbers.map(n => n[0]))];
    const endings = [...new Set(numbers.map(n => n[1]))];

    res.status(201).json({
      message: "Dream number created successfully",
      result: {
        id: newDream._id,
        dream: newDream.dream,
        numbers: newDream.numbers,
        house: houses,
        ending: endings,
        createdAt: newDream.createdAt,
        updatedAt: newDream.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Dream number already exists" });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update dream number
export const updateDreamNumber = async (req, res) => {
  try {
    const { dream, numbers } = req.body;

    const dreamNumber = await DreamNumber.findById(req.params.id);
    if (!dreamNumber) {
      return res.status(404).json({ message: "Dream number not found" });
    }

    dreamNumber.dream = dream || dreamNumber.dream;
    dreamNumber.numbers = numbers || dreamNumber.numbers;

    await dreamNumber.save();

    const houses = [...new Set(dreamNumber.numbers.map(n => n[0]))];
    const endings = [...new Set(dreamNumber.numbers.map(n => n[1]))];

    res.json({
      message: "Dream number updated successfully",
      result: {
        id: dreamNumber._id,
        dream: dreamNumber.dream,
        numbers: dreamNumber.numbers,
        house: houses,
        ending: endings,
        createdAt: dreamNumber.createdAt,
        updatedAt: dreamNumber.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete dream number
export const deleteDreamNumber = async (req, res) => {
  try {
    const dreamNumber = await DreamNumber.findByIdAndDelete(req.params.id);

    if (!dreamNumber) {
      return res.status(404).json({ message: "Dream number not found" });
    }

    res.json({ message: "Dream number deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total count of dream numbers
export const getDreamsCount = async (req, res) => {
  try {
    const count = await DreamNumber.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


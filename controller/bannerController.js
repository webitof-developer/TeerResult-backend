import Banner from '../models/Banner.js';

// Create banner
export const createBanner = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    let imagePath = null;

    // Handle image upload
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const banner = new Banner({
      title,
      image: imagePath,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    await banner.save();

    res.status(201).json({
      message: 'Banner created successfully',
      banner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({ banners });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active banners
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ banners });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get banner by ID
export const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.json({ banner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    let imagePath = null;

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Handle image upload
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    if (imagePath) {
      banner.image = imagePath;
    }

    await banner.save();

    res.json({
      message: 'Banner updated successfully',
      banner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle active status
export const toggleBannerActive = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({
      message: 'Banner status updated successfully',
      banner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.deleteOne();

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

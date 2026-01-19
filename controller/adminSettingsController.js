import AdminSettings from '../models/AdminSettings.js';

// Get admin settings
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin settings
export const updateAdminSettings = async (req, res) => {
  try {
    const { address, phone, email, openingHour, closingHour } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (openingHour !== undefined) settings.openingHour = openingHour;
    if (closingHour !== undefined) settings.closingHour = closingHour;

    await settings.save();

    res.json({
      message: 'Admin settings updated successfully',
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

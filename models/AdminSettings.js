import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    default: '123 Main Street, City, State 12345'
  },
  phone: {
    type: String,
    required: true,
    default: '+1 (555) 123-4567'
  },
  email: {
    type: String,
    required: true,
    default: 'Admin@teergame.com'
  },
  openingHour: {
    type: String,
    required: true,
    default: '9:00 AM'
  },
  closingHour: {
    type: String,
    required: true,
    default: '6:00 PM'
  }
}, {
  timestamps: true
});

const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);

export default AdminSettings;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit();
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In production, hash this password
      phone: '1234567890',
      address: 'Admin Address',
      role: 'Admin',
      isActive: true
    });

    await admin.save();

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();

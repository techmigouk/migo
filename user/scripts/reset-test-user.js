/**
 * Reset Test User Script
 * 
 * Deletes and recreates the test user with a fresh password hash
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'instructor', 'admin'], default: 'user' },
  avatar: String,
  bio: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetTestUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing test user
    console.log('\n🗑️  Deleting existing test user...');
    const deleteResult = await User.deleteOne({ email: 'test@example.com' });
    if (deleteResult.deletedCount > 0) {
      console.log('✅ Existing user deleted');
    } else {
      console.log('ℹ️  No existing user found');
    }

    // Create new password hash
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    console.log('✅ Password hashed');
    console.log('🔍 Hash preview:', hashedPassword.substring(0, 20) + '...');

    // Create new test user
    console.log('\n👤 Creating fresh test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      bio: 'Test user account for development and testing',
      enrolledCourses: [],
      completedCourses: [],
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');

    console.log('\n📋 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password: testpassword123');
    console.log('👤 User ID:', testUser._id);
    console.log('📝 Name:', testUser.name);
    console.log('🎭 Role:', testUser.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Verify the password works
    console.log('\n🧪 Testing password verification...');
    const isValid = await bcrypt.compare('testpassword123', testUser.password);
    if (isValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }

    console.log('\n🧪 Next Steps:');
    console.log('1. Navigate to: http://localhost:3004/login');
    console.log('2. Login with:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpassword123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error resetting test user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

resetTestUser();

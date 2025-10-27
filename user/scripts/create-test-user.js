/**
 * Create Test User Script
 * 
 * Creates a test user in MongoDB with bcrypt-hashed password
 * for testing NextAuth authentication.
 * 
 * Usage: node scripts/create-test-user.js
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

async function createTestUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Password: testpassword123');
      console.log('👤 User ID:', existingUser._id);
      console.log('📝 Name:', existingUser.name);
      console.log('🎭 Role:', existingUser.role);
      
      // Ask if we should update the password
      console.log('\n💡 If you want to reset the password, delete the user first and run this script again.');
      await mongoose.connection.close();
      return;
    }

    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    console.log('✅ Password hashed');

    console.log('\n👤 Creating test user...');
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

    console.log('\n🧪 Next Steps:');
    console.log('1. Start the user app: cd user && pnpm dev');
    console.log('2. Navigate to: http://localhost:3004/login');
    console.log('3. Login with:');
    console.log('   Email: test@example.com');
    console.log('   Password: testpassword123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    if (error.code === 11000) {
      console.log('💡 A user with this email already exists.');
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

createTestUser();

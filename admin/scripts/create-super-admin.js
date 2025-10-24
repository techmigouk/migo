const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://techmigouk_db_user:peDzbQUMxBxJhM5j@techmigo.t4bbyoi.mongodb.net/amigo_db?retryWrites=true&w=majority';

// User Schema (matching the shared model)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'instructor'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  avatar: { type: String },
  phone: { type: String },
  learningGoal: { type: String, enum: ['career', 'upskill', 'business'], default: 'upskill' },
  notificationPrefs: {
    courseUpdates: { type: Boolean, default: true },
    mentorshipMessages: { type: Boolean, default: true },
    communityMentions: { type: Boolean, default: true },
    billingNotifications: { type: Boolean, default: true }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function createSuperAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Super admin details
    const superAdminEmail = 'profmendel@gmail.com';
    const superAdminPassword = 'Gig@50chin';
    const superAdminName = 'Prof Mendel';

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: superAdminEmail });
    
    if (existingAdmin) {
      console.log('ℹ️  Super admin already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      
      // Update password, role, and name
      console.log('🔐 Updating password and admin details...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superAdminPassword, salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.name = superAdminName;
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();
      console.log('✅ Updated admin user with new password and details');
    } else {
      // Hash the password
      console.log('🔐 Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

      // Create super admin
      console.log('👤 Creating super admin...');
      const superAdmin = new User({
        email: superAdminEmail,
        name: superAdminName,
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        notificationPrefs: {
          courseUpdates: true,
          mentorshipMessages: true,
          communityMentions: true,
          billingNotifications: true
        }
      });

      await superAdmin.save();
      console.log('✅ Super admin created successfully!');
      console.log('📧 Email:', superAdmin.email);
      console.log('👤 Name:', superAdmin.name);
      console.log('🔑 Role:', superAdmin.role);
      console.log('🔒 Password: Gig@50chin');
    }

    console.log('\n✨ Super admin is ready to use!');
    console.log('📍 Login at: http://localhost:3001/login');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSuperAdmin();

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://techmigouk_db_user:peDzbQUMxBxJhM5j@techmigo.t4bbyoi.mongodb.net/amigo_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
    const courses = await Course.find({}).limit(20);
    
    console.log('\nTotal courses found:', courses.length);
    
    if (courses.length > 0) {
      console.log('\nCourse details:');
      courses.forEach((course, index) => {
        console.log(`\n${index + 1}. ${course.title || 'Untitled'}`);
        console.log(`   Course ID: ${course._id}`);
        console.log(`   Status: ${course.status || 'N/A'}`);
        console.log(`   Category: ${course.category || 'N/A'}`);
        console.log(`   Price: ${course.price || 0}`);
      });
    } else {
      console.log('\nNo courses found in database.');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });

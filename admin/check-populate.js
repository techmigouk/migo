const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://techmigouk_db_user:peDzbQUMxBxJhM5j@techmigo.t4bbyoi.mongodb.net/amigo_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const Lesson = mongoose.model('Lesson', new mongoose.Schema({}, { strict: false }));
    
    // Fetch lessons with populate like the API does
    const lessons = await Lesson.find({})
      .sort({ order: 1 })
      .populate('courseId', 'title')
      .lean();
    
    console.log('Sample lesson structure after populate:');
    console.log(JSON.stringify(lessons[0], null, 2));
    
    console.log('\n\nAll lessons courseId values:');
    lessons.forEach((lesson, idx) => {
      console.log(`${idx + 1}. ${lesson.title}`);
      console.log(`   courseId type: ${typeof lesson.courseId}`);
      console.log(`   courseId value:`, lesson.courseId);
      console.log('');
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://techmigouk_db_user:peDzbQUMxBxJhM5j@techmigo.t4bbyoi.mongodb.net/amigo_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const Lesson = mongoose.model('Lesson', new mongoose.Schema({}, { strict: false }));
    const lessons = await Lesson.find({})
      .sort({ courseId: 1, order: 1 })
      .lean();
    
    console.log('='.repeat(80));
    console.log('API ENDPOINTS FOR LESSONS:');
    console.log('='.repeat(80));
    
    // Group by course
    const courseMap = {};
    lessons.forEach(lesson => {
      const courseId = lesson.courseId.toString();
      if (!courseMap[courseId]) {
        courseMap[courseId] = [];
      }
      courseMap[courseId].push(lesson);
    });
    
    Object.keys(courseMap).forEach((courseId, idx) => {
      const courseLessons = courseMap[courseId];
      console.log(`\n${idx + 1}. Course ID: ${courseId}`);
      console.log(`   API Endpoint: /api/courses/${courseId}/lessons`);
      console.log(`   Total Lessons: ${courseLessons.length}`);
      console.log(`   Individual Lesson Endpoints:`);
      
      courseLessons.forEach((lesson, lessonIdx) => {
        console.log(`\n   ${lessonIdx + 1}. ${lesson.title || 'Untitled'}`);
        console.log(`      Lesson ID: ${lesson._id}`);
        console.log(`      API: /api/lessons/${lesson._id}`);
        console.log(`      Order: ${lesson.order || 'N/A'}`);
        console.log(`      Duration: ${lesson.duration || 'N/A'} min`);
        console.log(`      Preview: ${lesson.isPreview ? 'Yes' : 'No'}`);
        console.log(`      Video URL: ${lesson.videoUrl ? 'Yes' : 'No'}`);
      });
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('SAMPLE API RESPONSE STRUCTURE:');
    console.log('='.repeat(80));
    console.log('\nGET /api/courses/[courseId]/lessons');
    console.log(JSON.stringify(lessons.slice(0, 2).map(l => ({
      _id: l._id,
      courseId: l.courseId,
      title: l.title,
      description: l.description,
      order: l.order,
      videoUrl: l.videoUrl ? '[URL]' : null,
      duration: l.duration,
      isPreview: l.isPreview
    })), null, 2));
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });

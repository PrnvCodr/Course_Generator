const { generateCourseOutline, generateLessonContent } = require('../services/promptService');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');

/**
 * POST /api/generate-course
 * Generates a course outline using AI (does NOT save to DB)
 */
const generateCourse = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({ error: 'Please provide a valid topic (at least 3 characters)' });
    }

    const courseData = await generateCourseOutline(topic.trim());
    res.json({ success: true, course: courseData });
  } catch (error) {
    console.error('Course generation error:', error.message);
    next(error);
  }
};

/**
 * POST /api/generate-lesson
 * Generates detailed lesson content using AI
 */
const generateLesson = async (req, res, next) => {
  try {
    const { courseTitle, moduleTitle, lessonTitle } = req.body;
    if (!courseTitle || !moduleTitle || !lessonTitle) {
      return res.status(400).json({ error: 'courseTitle, moduleTitle, and lessonTitle are required' });
    }

    const lessonData = await generateLessonContent(courseTitle, moduleTitle, lessonTitle);
    res.json({ success: true, lesson: lessonData });
  } catch (error) {
    console.error('Lesson generation error:', error.message);
    next(error);
  }
};

/**
 * POST /api/courses
 * Saves a complete generated course to MongoDB
 */
const saveCourse = async (req, res, next) => {
  try {
    const { title, description, tags, modules, prompt } = req.body;
    const creator = req.auth?.payload?.sub;
    if (!creator) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Create Course document
    const course = new Course({ title, description, tags, creator, prompt });
    await course.save();

    const moduleIds = [];
    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      const moduleDoc = new Module({ title: mod.title, course: course._id, order: i });
      await moduleDoc.save();

      const lessonIds = [];
      for (let j = 0; j < (mod.lessons || []).length; j++) {
        const lessonTitle = typeof mod.lessons[j] === 'string' ? mod.lessons[j] : mod.lessons[j].title;
        const lessonDoc = new Lesson({
          title: lessonTitle,
          content: [],
          module: moduleDoc._id,
          order: j,
        });
        await lessonDoc.save();
        lessonIds.push(lessonDoc._id);
      }

      moduleDoc.lessons = lessonIds;
      await moduleDoc.save();
      moduleIds.push(moduleDoc._id);
    }

    course.modules = moduleIds;
    await course.save();

    const populated = await Course.findById(course._id)
      .populate({ path: 'modules', populate: { path: 'lessons' } });

    res.status(201).json({ success: true, course: populated });
  } catch (error) {
    console.error('Save course error:', error.message);
    next(error);
  }
};

/**
 * GET /api/courses
 * Lists all courses (or user's courses if authenticated)
 */
const getCourses = async (req, res, next) => {
  try {
    const creator = req.auth?.payload?.sub;
    if (!creator) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const courses = await Course.find({ creator })
      .populate({ path: 'modules', select: 'title order' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Gets a single course fully populated
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(id)
      .populate({ path: 'modules', populate: { path: 'lessons' } });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/courses/:id
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check ownership
    const creator = req.auth?.payload?.sub;
    if (creator && course.creator !== creator && course.creator !== 'anonymous') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    // Cascade delete modules and lessons
    for (const modId of course.modules) {
      const mod = await Module.findById(modId);
      if (mod) {
        await Lesson.deleteMany({ _id: { $in: mod.lessons } });
        await mod.deleteOne();
      }
    }
    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/lessons/:id
 * Save enriched lesson content
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, objectives } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { content, objectives, isEnriched: true },
      { new: true }
    );

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateCourse, generateLesson, saveCourse, getCourses, getCourseById, deleteCourse, updateLesson };

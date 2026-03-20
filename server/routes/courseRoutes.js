const express = require('express');
const router = express.Router();
const {
  generateCourse,
  generateLesson,
  saveCourse,
  getCourses,
  getCourseById,
  deleteCourse,
  updateLesson,
} = require('../controllers/courseController');
const { optionalAuth, requireAuth } = require('../middlewares/authMiddleware');

// AI Generation — public
router.post('/generate-course', generateCourse);
router.post('/generate-lesson', generateLesson);

// Course CRUD — optionalAuth attaches userSub when token is present
router.get('/courses',        requireAuth, getCourses);
router.post('/courses',       requireAuth, saveCourse);
router.get('/courses/:id',    optionalAuth, getCourseById);
router.delete('/courses/:id', optionalAuth, deleteCourse);
router.put('/lessons/:id',    optionalAuth, updateLesson);

module.exports = router;

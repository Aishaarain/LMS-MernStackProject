import express from 'express';

import { getAllCourses, getCourseById } from '../controllers/courseController.js';


const courseRouter= express.Router(); 

courseRouter.get('/all', getAllCourses);
courseRouter.get('/:id', getCourseById);
// courseRouter.get('/:courseId/detail-with-status', getCourseDetailWithPurchaseStatus);

export default courseRouter;
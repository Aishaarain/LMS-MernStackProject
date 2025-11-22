import express from 'express';

import { getUserData, userEnrolledCourses, purchaseCourse, updateCourseProgress, getCourseProgress, addCourseRating, addCourseComment } from '../controllers/userController.js';
import { useReducer } from 'react';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
// userRouter.post('/update-course-progress', updateCourseProgress);
// router.post('/get-course-progress', getCourseProgress);
// router.post('/add-rating', addCourseRating);
// router.post("/add-comment", addCourseComment);


export default userRouter;
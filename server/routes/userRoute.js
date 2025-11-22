import express from 'express';

import { getUserData, userEnrolledCourses, purchaseCourse, updateUserCourseProgress, getCourseProgress, addCourseRating, addCourseComment } from '../controllers/userController.js';
import { useReducer } from 'react';

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getCourseProgress);
userRouter.post('/add-rating', addCourseRating);
// router.post("/add-comment", addCourseComment);


export default userRouter;
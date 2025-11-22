import express from 'express'
import  {UpdateRoleToEducator,AddNewCourse, GetEducatorCourses, EducatorDashboardData,GetEnrolledStudents} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducatorRoute } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()

// Add Educator Role
educatorRouter.get('/update-role', UpdateRoleToEducator)
educatorRouter.post('/add-course', upload.single('courseThumbnail'), protectEducatorRoute,AddNewCourse)
educatorRouter.get('/my-course', protectEducatorRoute, GetEducatorCourses)
educatorRouter.get('/dashboard', protectEducatorRoute, EducatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducatorRoute, GetEnrolledStudents)

export default educatorRouter;


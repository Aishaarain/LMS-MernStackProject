import express from 'express'
import  {UpdateRoleToEducator,AddNewCourse} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducatorRoute } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()

// Add Educator Role
educatorRouter.get('/update-role', UpdateRoleToEducator)
educatorRouter.post('/add-courses', upload.single('courseThumbnail'), protectEducatorRoute, AddNewCourse)

export default educatorRouter;


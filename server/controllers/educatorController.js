import { clerkClient } from "@clerk/express"
import Course from "../models/Course.js"
import cloudinary from 'cloudinary';
import Purchase from "../models/purchaseModel.js";

const { v2: cloud } = cloudinary;

export const UpdateRoleToEducator = async (req,res)=>{
    try{
const userId = req.auth.userId

await clerkClient.users.updateUserMetadata(userId,{
    publicMetadata:{
        role:'educator',
    }
})
res.json({success: true,message :"you can publish a course now"})
    }catch(error){
res.json({success: false , message: error.message})
    }
}

// Add New Course
export const AddNewCourse = async (req,res)=>{
    try{
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

       
        if(!imageFile){
            return res.json({success: false, message: "Course thumbnail is required"})
        }
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload= await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail= imageUpload.secure_url
        await newCourse.save()
        res.json({success: true, message: "Course created successfully", course: newCourse})
                }
        catch(error){ 
        res.json({success: false , message: error.message})
            }  }

// get educatior courses
export const GetEducatorCourses = async (req,res)=>{
    try{
        const educatorId = req.auth.userId      
        const courses = await Course.find({ educatorId})
        res.json({success: true, courses})
    }catch(error){
        res.json({success: false , message: error.message})
    }       }

    // get educator dashboard data (total earning, enrolled students, no of courses)

    export const EducatorDashboardData = async (req,res)=>{
        try{
            const educatorId = req.auth.userId;
            // total courses
            const Courses = await Course.find({  educatorId});

            const totalCourses = Courses.length;
            const courseIds = Courses.map((course) => course._id);
            
            const purchases = await Purchase.find({ courseId: { $in: courseIds },
            status: 'completed' });
            const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

            const enrolledStudentsData = [];

            for (const course of Courses){
const students = await User.find({
    _id:{$in: course.enrolledStudentsData}
},'name imageUrl');
students.forEach((student)=>{
    enrolledStudentsData.push({
        courseTitle: course.courseTitle,
        student
    });
}); 
            }

            res.json({
                success: true,
                dashboardData: {
                    totalCourses,
                    totalEarnings,
                    enrolledStudentsData,
                },
            });
        }catch(error){
            res.json({success: false , message: error.message})
        }}

        // get enrolled students for a course
        export const GetEnrolledStudents = async (req,res)=>{
            try{
                const educator = req.auth.userId;
                const courses = await Course.find({educator});
                const courseIds = courses.map((course)=> course._id);
               
                const purchases = await Purchase.find({
                    courseId: {$in: courseIds},
                    status: 'completed',    
                }).populate('userId','name imageUrl').populate('courseId','courseTitle');

                const enrolledStudents = purchases.map((purchase)=>({
                    student: purchase.userId,
                    course: purchase.courseId.courseTitle,
                    purchaseDate: purchase.createdAt,
                }));
                res.json({success: true, enrolledStudents});
            }
            catch(error){
                res.json({success: false , message: error.message})
            }
        }

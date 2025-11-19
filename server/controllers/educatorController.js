import { clerkClient } from "@clerk/express"
import Course from "../models/Course.js"
import cloudinary from 'cloudinary';

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

// // Add New Course
// export const AddNewCourse = async (req,res)=>{
//     try{
//         const {courseData} = req.body
//         const imageFile = req.file
//         const educatorId = req.auth.userId

//         if(!imageFile){
//             return res.json({success: false, message: "Course thumbnail is required"})
//         }
//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const newCourse = await Course.create(parsedCourseData)
//         const imageUpload= await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail= imageUpload.secure_url
//         await newCourse.save()
//         res.json({success: true, message: "Course created successfully", course: newCourse})
//                 }
//         catch(error){ 
//         res.json({success: false , message: error.message})
//             }   }



export const AddNewCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Course thumbnail is required" });
    }

    // Upload image to Cloudinary first
    const imageUpload = await cloud.uploader.upload(imageFile.path);

    // Get other fields from req.body
    const { courseTitle, courseDescription, coursePrice, discount, chapters } = req.body;

    if (!courseTitle || !courseDescription || !coursePrice) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const newCourse = await Course.create({
      title: courseTitle,
      description: courseDescription,
      price: coursePrice,
      discount: discount || 0,
      chapters: chapters ? JSON.parse(chapters) : [],
      courseThumbnail: imageUpload.secure_url,
      educator: educatorId
    });

    res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

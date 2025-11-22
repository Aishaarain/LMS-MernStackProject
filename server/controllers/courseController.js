
import CourseModel from "../models/Course.js";


// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });
    res.json({ success: true, courses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// get course by id
export const getCourseById = async (req, res) => {
    const {id} =req.params;
  try {
    const courseData = await CourseModel.findById(id).populate({
        path: "educator",
      })
      courseData.courseContent.forEach((chapter) => {
        chapter.chapterContent.forEach((lecture) => {
          if (!lecture.isPreviewFree) {
            lecture.lectureUrl = "";
          }
        });
      });
res.json({ success: true, course: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

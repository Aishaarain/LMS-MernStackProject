import CourseModel from "../models/Course.js";
import PurchaseModel from "../models/purchaseModel.js";
import UserModel from "../models/User.js";
// import Stripe from "../configs/Stripe.js";
import CourseProgress from "../models/courseProgressModel.js";

 
// get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
   const user = await UserModel.findById(userId);
    // If user isn't authenticated, return a 401 error
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }


    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// users enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
            const userData = await UserModel.findById( userId ).populate('enrolledCourses');
    

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// purchase course
    
export const purchaseCourse = async (req, res) => { 
  try {
    const { courseId } = req.body;
    const userId = req.auth.userId;
    const { origin } = req.headers;
    const userData = await UserModel.findById(userId);
const courseData = await CourseModel.findById(courseId);
    if (!userData || !courseData) {
      return res.json({ success: false, message: "data not found" });
    }
    const purschaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
    }

    const newPurchase = new PurchaseModel.create(purschaseData);

    // stripe gateway
const stripeInstance = new Stripe (process.env.STRIPE_SECRET_KEY);
const currency = process.env.CURRENCY.toLowerCase()
;

// creating line items for stripe
const line_items =[{
price_data:{
  currency,product_data:{
    name: courseData.courseTitle,
  },
  unit_amount: Math.round (newPurchase.amount * 100),
},
quantity:1,
}]

const session = await stripeInstance.checkout.sessions.create({
  success_url: `${origin}/loading/my-enrollments`,
  cancel_url: `${origin}/`,
  mode: 'payment',
  line_items:line_items,
  metadata:{
    purchaseId: newPurchase._id.toString(),
  }
});   
res.json({ success: true, session_url: session.url });
  }
catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}



// update user course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const progressData = await CourseProgress.findOne({
      userId: user._id,
      courseId,
    });
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture already completed",
        });
       
      }
    progressData.lectureCompleted.push(lectureId);
      await progressData.save();

    } else {
      const newProgressData = {
        userId: user._id,
        courseId,
        lectureCompleted: [lectureId],
      };
      await CourseProgress.create(newProgressData);
    }

    res.json({ success: true, message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user course " });
  }
};

// get user course progress
export const getCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne( userId );

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const progressData = await CourseProgress.findOne({
      userId: user._id,
      courseId,
    });

    res.json({ success: true, progressData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: error.message   });
  }
};

// add user rating to course
export const addCourseRating = async (req, res) => {
 
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // If user isn't authenticated, return a 401 error
    if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
      return res.json({ success:'false',message: "Invalid Details" });
    }

   
 try {
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .json({ success: false, message: "Course not found" });
    }

    const user = await UserModel.findbyId( userId );

    if (!user || !user.enrolledCourses.includes(courseId)) {
return res
        .json({ success: false, message: "User not purchase the course" });
    }

    const existRatingIndex = course.courseRatings.findIndex(
      (courseRating) => courseRating.userId === userId
    );

    if (existRatingIndex > -1) {
      course.courseRatings[existRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    res.json({ success: true, message: "Rating added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: message.error });
  }

};

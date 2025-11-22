import { createContext, useEffect,useNavigate } from "react";
import { dummyCourses } from "../assets/assets";
import { useState } from "react";
import humanizeDuration from "humanize-duration";
export const AppContext = createContext();
import {useAuth,useUser} from '@clerk/clerk-react'

export const AppProvider = (props) => {

  const currency = import.meta.env.VITE_CURRENCY;
const navigate= useNavigate;

const {getToken} = useAuth();
const {user} = useUser()

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([])
//fetch all courses from backend

//function to calculate  average rating of course
const CalculateRating =(course)=>{
        if (course.courseRatings.length === 0){
          return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
          totalRating += rating.rating;
        })
        return totalRating / course.courseRatings.length;
}

// function to calculate course chapter time
const calculateChapterTime = (chapter)=>{
  let time = 0;
  chapter.chapterContent.map((lecture)=> 
  time +=lecture.lectureDuration)
  return humanizeDuration(time * 60 * 1000,{units:["h", "m"]})
}

// function to calculate course duration
const calculateCourseDuration =(course)=>{
  let time=0
  course.courseContent.map((chapter)=>chapter.chapterContent.map(
    (lecture )=> time += lecture.lectureDuration 
  ))
  return humanizeDuration(time* 60 *1000, {units:["h","m"]})
}

// function to caculate to No of lectures in the course
const calculateNoofLectures = (course)=>{
  let totalLectures = 0;
  course.courseContent.forEach(chapter=>{
    if(Array.isArray(chapter.chapterContent)){
      totalLectures +=chapter.chapterContent.length
    }
  });
  return totalLectures;
}

// fetch user enrolled courses
const fetchUserEnrolledCourses = async()=>{
 setEnrolledCourses(dummyCourses)
}

const fetchAllCourses = async () => {
setAllCourses(dummyCourses)
}

useEffect(() => {
  fetchAllCourses();
}, []);

const logToken = async ()=>{
  console.log(await getToken());
}

useEffect(()=>{
  if(user){
  logToken()
  }
},[user])


  const sharedState = {
currency,allCourses,navigate,  CalculateRating,isEducator,setIsEducator,
calculateChapterTime, calculateCourseDuration, calculateNoofLectures,enrolledCourses, fetchUserEnrolledCourses
    // Define any shared state or functions here
  };

  return (
    <AppContext.Provider value={sharedState}>
      {props.children}
    </AppContext.Provider>
  );
};
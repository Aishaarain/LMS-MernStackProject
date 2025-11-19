import { createContext, useEffect,useNavigate } from "react";
import { dummyCourses } from "../assets/assets";
import { useState } from "react";
import humanizeDuration from "humanize-duration";
export const AppContext = createContext();
import {useAuth,useUser} from '@clerk/clerk-react'
import { toast } from "react-toastify";
import axios from "axios";
export const AppProvider = (props) => {

  const currency = import.meta.env.VITE_CURRENCY;
const navigate= useNavigate;

const {getToken} = useAuth();
const {user} = useUser()

const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData, setUserData] = useState(null);

 


  // fetch user data
  const fetchUserData = async () => {
    if (user.publicMetadata.role === 'educator') {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
    const { data } = await axios.get(`${backendURL.trim()}/api/user/data`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
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
 const fetchUserEnrolledCourses = async () => {
    // setEnrolledCourses(dummyCourses.filter(course => course.enrolledStudents.includes('user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V')));
    try {
      const token = await getToken();
    const { data } = await axios.get(`${backendURL.trim()}/api/user/enrolled-courses`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


const fetchAllCourses = async () => {
try{
  const {data} =await axios.get(backendURL+ '/api/course/all')
  if(data.success){
    setAllCourses(data.courses)}
    else{
      toast.error(data.message)
    }
}catch(error){
  console.error("Error fetching courses:", error.message);    
}}

useEffect(() => {
  fetchAllCourses();
}, []);

const logToken = async ()=>{
  console.log(await getToken());
}

useEffect(()=>{
  if(user){
  logToken()
  fetchUserData()
  fetchUserEnrolledCourses()
  }
},[user])


  const sharedState = {
currency,allCourses,navigate,  CalculateRating,isEducator,setIsEducator,
calculateChapterTime, calculateCourseDuration, calculateNoofLectures,enrolledCourses, fetchUserEnrolledCourses
,backendURL,userData,setUserData,getToken
    // Define any shared state or functions here
  };

  return (
    <AppContext.Provider value={sharedState}>
      {props.children}
    </AppContext.Provider>
  );
};
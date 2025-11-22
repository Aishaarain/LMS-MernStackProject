import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = (props) => {


  const currency = import.meta.env.VITE_CURRENCY;
const navigate= useNavigate();
const backendURL = import.meta.env.VITE_BACKEND_URL;

const {getToken} = useAuth();
const {user} = useUser()

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([])
const [userData, setUserData] = useState(null);
  //fetch all courses from backend


//function to calculate  average rating of course
const CalculateRating =(course)=>{
        if (!course || !course?.courseRatings || course?.courseRatings?.length === 0){
          return 0;
        }
        let totalRating = 0;
        course?.courseRatings?.forEach((rating) => {
          totalRating += rating.rating;
        })
        return Math.floor(totalRating / course?.courseRatings?.length);
}

// function to calculate course chapter time
const calculateChapterTime = (chapter)=>{
  let time = 0;
  chapter?.chapterContent?.map((lecture)=> 
  time +=lecture?.lectureDuration)
  return humanizeDuration(time * 60 * 1000,{units:["h", "m"]})
}

// function to calculate course duration
const calculateCourseDuration =(course)=>{
  let time=0
  course?.courseContent?.map((chapter)=>chapter?.chapterContent?.map(
    (lecture )=> time += lecture?.lectureDuration 
  ))
  return humanizeDuration(time* 60 *1000, {units:["h","m"]})
}

// function to caculate to No of lectures in the course
const calculateNoofLectures = (course)=>{
  let totalLectures = 0;
  course?.courseContent?.forEach(chapter=>{
    if(Array.isArray(chapter?.chapterContent)){
      totalLectures +=chapter?.chapterContent?.length
    }
  });
  return totalLectures;
}

// fetch user enrolled courses
const fetchUserEnrolledCourses = async()=>{
 try{
  const token = await getToken();
 const {data} = await axios.get(backendURL +'/api/user/enrolled-courses',{
  headers: {Authorization:`Bearer ${token}`}
 })
 if(data.success){
  setEnrolledCourses(data?.enrolledCourses.reverse())
 }  else{
  toast.error(data.message)
 }}
 catch(error){
  toast.error(error.message)
 }
}

const fetchAllCourses = async () => {
try{
const {data} = await axios.get(backendURL + '/api/course/all')

if(data.success){
  setAllCourses(data.courses)
}
else{
  toast.error(data.message)
}
}
catch(error){
toast.error(error.message)
}
}

// fetch user data
const fetchUserData = async()=>{
  if(user.publicMetadata.role == 'educator'){
    setIsEducator(true)
  }
  try{
    const token = await getToken()
   const {data}= await axios.get(backendURL + '/api/user/data',{headers: {Authorization:`Bearer ${token}`}})

   if(data.success){
    setUserData(data.userData)
   } 
   else{
    toast.error(data.message)
   }
    }
    catch(error){
      toast.error(error.message)
    }
  }

useEffect(() => {
  fetchAllCourses();
   fetchUserEnrolledCourses()
}, [user]);

const logToken = async ()=>{
  console.log(await getToken());
}

useEffect(()=>{
  if(user){
  logToken()
  fetchUserData()
  }
},[user])


  const sharedState = {
currency,allCourses,navigate,  CalculateRating,isEducator,setIsEducator,
calculateChapterTime, calculateCourseDuration, calculateNoofLectures,enrolledCourses, fetchUserEnrolledCourses,
fetchAllCourses,backendURL,userData,setUserData,getToken
    // Define any shared state or functions here
  };

  return (
    <AppContext.Provider value={sharedState}>
      {props.children}
    </AppContext.Provider>
  );
}
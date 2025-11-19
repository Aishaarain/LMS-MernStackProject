
import { AppContext } from '../../context/Appcontext'
import React, { useContext, useEffect, useState } from "react";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const MyEnrollments = () => {

  const {enrolledCourses,calculateCourseDuration} = useContext(AppContext);


const MyEnrollments = () => {
  const { 
    enrolledCourses, 
    calculateCourseDuration, 
    calculateNoOfLectures, 
    getToken, 
    userData, 
    fetchUserEnrolledCourse, 
    backendUrl 
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  // Fetch course progress from backend
  const getCoursesProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const totalLecture = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return { totalLecture, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserEnrolledCourse();
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) getCoursesProgress();
  }, [enrolledCourses]);
}

  return (
    <>
    <div className='px-8 md:px-36 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden '>
          <tr>
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {enrolledCourses.map((courses, index)=>(
          <tr className='border-b border-gray-500/20 ' key={index}>
            <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 '>
              <img src={courses.courseThumbnail} alt="" className='w-14 sm:w-24 ms:w-28' />
              <div className='flex-1'>
                <p className='mb-1 max-sm:text-sm'>{courses.courseTitle}</p>
                <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100)/progressArray[index].totalLectures :0} className='bg-gray-300 rounded-full'/>
              </div>

            </td>

            <td className='px-4 py-3 max-sm:hidden'>
              {calculateCourseDuration(courses)}
            </td>
            <td className='px-4 py-3 max-sm:hidden'>
          {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} <span>Lectures</span>
            </td>
<td className='px-4 py-3 max-sm:text-right'>
<Link to={`/player/${courses._id} `} ><button >{progressArray[index] && progressArray[index].lectureCompleted/progressArray[index].totalLectures === 1 ? 'Completed' :'On Going'} </button></Link>
</td>

          </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  )
}
export default MyEnrollments


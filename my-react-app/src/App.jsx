import {Routes,Route, useMatch} from 'react-router-dom'
import HomePage from './pages/student/Home'
import EducatorPage from './pages/educator/EducatorPage'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import AddCoursePage from './pages/educator/AddCoursePage'
import StudentsEnroll from './pages/educator/StudentsEnroll'
import CourseDetails from './pages/student/CourseDetails'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import CourseList from './pages/student/CourseList'
import Loading from './components/student/Loading'
import Navbar from './components/student/Navbar'
import 'quill/dist/quill.snow.css';
import {ToastContainer} from 'react-toastify'
export default function App() {

  const isEducatorRoute = useMatch('/educator/*')
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute &&<Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/educator" element={<EducatorPage />}>
          <Route index path='/educator' element={<Dashboard />} />
          <Route index path="my-courses" element={<MyCourses />} />
          <Route index path="add-courses" element={<AddCoursePage />} />
          <Route index path="student-enrolled" element={<StudentsEnroll />} />
        </Route>

        {/* <Route path="/student/course-details" element={<CourseDetails />} /> */}
         <Route path="/student/course/:id" element={<CourseDetails />} />
        <Route path="/player/:courseId" element={<Player />} />

        <Route path="/enrolled-courses" element={<MyEnrollments />} />

         <Route path="/student/course-list" element={<CourseList />} />
           <Route path="/student/course-list/:input" element={<CourseList />} />
        <Route path="/loading/:path" element={<Loading />} />
      </Routes>
    </div>
  )
}
 
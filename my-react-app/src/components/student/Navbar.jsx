
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk ,UserButton , useUser} from '@clerk/clerk-react'
import { AppContext } from '../../context/Appcontext'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
 
  
  const isCourseListPage= location.pathname.includes('/course-list');
const {openSignIn} = useClerk();
const {user} = useUser();
const {isEducator,setIsEducator,getToken,navigate,backendURL,} = useContext(AppContext);

const becomeEducatorHandler = async()=>{
  try {
    if(isEducator){
      navigate('/educator')
      return;
    }
    const token = await getToken();
    const {data} = await axios.get(backendURL + '/api/educator/update-role',{headers:{Authorization: `Bearer ${token}`}})
    if(data.success){
    setIsEducator(true);
    toast.success(data.message);
    }
    else{
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message) 
      }}
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage? 'bg-white' : 'bg-cyan-100/70'}`}>
       <Link to="/"> <img src={assets.logo} alt="Logo" 
        className='w-28 lg:w-32 cursor-pointer ' /></Link>
     <div className='hidden md:flex items-center gap-5 text-gray-500 '>
      <div className='flex items-center gap-5'>

             { user && <>
           <Link to='/educator'>  <button onClick={becomeEducatorHandler} >{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button></Link> 
             <Link to="/enrolled-courses">|My Enrollments </Link>
             </>}
            
      </div>
{user ? <UserButton /> :
      <button onClick={()=> openSignIn()} className='bg-blue-600 text-white rounded-full px-5 py-2'>Create Account</button>}
     </div>

     {/* for mobile view */}
     <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500  ' >
         <div className='flex items-center gap-5'>
          <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
             { user && <>
              <Link to='/educator'>  <button >{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button></Link> 
             <Link  to="/enrolled-courses">|My Enrollments </Link>
             </>}
             </div>
      </div>

      <button onClick={()=> openSignIn()}>
        {user ? <UserButton/>:
        <img  src={assets.user_icon} alt="" />
}
      </button>
      </div>
    </div>
  )
}

export default Navbar



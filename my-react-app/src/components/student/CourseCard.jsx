// import React, { useContext } from 'react'
// import {assets} from '../../assets/assets'
// import { AppContext } from '../../context/Appcontext';
// import {Link} from 'react-router-dom';

// const CourseCard = ({course}) => {

//   const {currency, CalculateRating}= useContext(AppContext);

//   return (
//     <Link to={`/student/course-details/${course._id}`} onClick={()=>scrollTo(0,0)}  className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'> 
//        <img className='w-full' src={course.courseThumbnail} alt="coursetitle" />
//        <div className='p-3 text-left'>
//         <h3 className='text-base font-semibold'>{course.Title}</h3>
//         <p className='text-gray-500'>TechStack</p>
//         <div className='flex items-center space-x-2'>
//           <p>{CalculateRating(course)}</p>
//           <div className='flex'>
//             {[...Array(5)].map((_,i)=>(
//           <img key={i} src={i< Math.floor(CalculateRating(course)) ? assets.star : assets.star_blank} alt="star"
//           className='w-3.5 h-3.5' />
//           ))}
//           </div>
//           <p className='text-gray-500'>{course.courseRatings.length}</p>
//         </div>
//         <p className='text-base font-semibold text-gray-800 '>{currency}{(course.coursePrice - course.discount*course.coursePrice/100).toFixed(2) }</p>
//        </div>
//     </Link>
//   )
// }

// export default CourseCard

import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/Appcontext';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const CourseCard = ({ course }) => {
  const { currency, calculateAverageRating } = useContext(AppContext);

  return (
    <Link
      to={`/course/${course._id}`}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
      onClick={() => window.scrollTo(0, 0)}
    >
      <img className="w-full" src={course.courseThumbnail} alt={course.courseTitle} />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course.educator.name}</p>

        {/* Rating component */}
        <Rating course={course} />

        {/* Price after discount */}
        <p className="text-base font-semibold text-gray-800">
          {currency} {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;

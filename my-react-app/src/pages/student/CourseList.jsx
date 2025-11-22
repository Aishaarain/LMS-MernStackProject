import { Link, useParams } from 'react-router-dom';
import Searchbar from '../../components/student/SearchBar';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../src/context/Appcontext';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CourseDetails = () => {
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourses(
            tempCourses.filter(course =>
              (course.courseTitle)
                .toLowerCase()
                .includes(input.toLowerCase())
            )
          )
        : setFilteredCourses(tempCourses);
    }
  }, [input, allCourses]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
            <p className="text-gray-500">
              <Link to="/">
                <span className="text-blue-600 cursor-pointer">Home</span>
              </Link>{' '}
              / <span>Course List</span>
            </p>
          </div>
          <Searchbar data={input} />
        </div>

        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <Link to="/student/course-list">
              <img
                src={assets.cross_icon}
                alt=""
                className="cursor-pointer"
              />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-auto  my-16 gap-3 px-3 md:p-0">
          {filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CourseDetails;

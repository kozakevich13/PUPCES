
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { endPoint } from "../../config";


const GradeContext = createContext();

export function useGradeContext() {
  return useContext(GradeContext);
}

export function GradeProvider({ children }) {
  const [gradesAndRemarks, setGradesAndRemarks] = useState([]);

  useEffect(() => {
    // Fetch data from the server and update setGradesAndRemarks
    fetch(`${endPoint}/grades`)
      .then((response) => response.json())
      .then((data) => setGradesAndRemarks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateGradesAndRemarks = (courseCode, newGrades, newRemarks) => {
    

    // Update the context state as well
    setGradesAndRemarks((prevGradesAndRemarks) =>
      prevGradesAndRemarks.map((item) =>
        item.course_code === courseCode
          ? { ...item, grades: newGrades, remarks: newRemarks }
          : item
      )
    );
  };

  return (
    <GradeContext.Provider value={{ gradesAndRemarks, updateGradesAndRemarks }}>
      {children}
    </GradeContext.Provider>
  );
}

GradeProvider.propTypes = {
  children: PropTypes.node,
};
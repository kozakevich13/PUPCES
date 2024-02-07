// import  {  useState } from "react";
// import {
 
//   Select,
 
//   Table,
//   Tbody,
//   Td,
//   Th,
//   Thead,
//   Tr,
//   Tfoot,
// } from "@chakra-ui/react";

// import PropTypes from "prop-types";

// function CourseTable({ course, courseYear, courseSemester }) {
//   const [selectedGrades, setSelectedGrades] = useState({});

//   // Function to handle grade selection
//   const handleGradeSelection = (courseCode, grade) => {
//     setSelectedGrades({
//       ...selectedGrades,
//       [courseCode]: grade,
//     });
//   };

//   // Function to calculate remarks based on grades
//   const calculateRemarks = (grade) => {
//     if (grade >= 1.0 && grade <= 3.0) {
//       return "P";
//     } else if (grade >= 3.25 && grade <= 5.0) {
//       return "F";
//     } else {
//       return "";
//     }
//   };

//   const renderPrerequisites = (prerequisites) => {
//     if (!prerequisites) return null;

//     const prerequisiteList = prerequisites.split(",");

//     return (
//       <>
//         {prerequisiteList.map((prerequisite, index) => (
//           <div key={index}>{prerequisite.trim()}</div>
//         ))}
//       </>
//     );
//   };


  

//   return (
//     <Table variant="simple" size="sm" style={{ minWidth: "800px" }}>
//       <Thead bg="#862B0D" h="5rem">
//         <Tr>
//           <Th style={{ textAlign: "center" }} color="white">
//             Course Code
//           </Th>
//           <Th color="white">Course Title</Th>
//           <Th w="1rem" color="white">
//             Pre-Requisite(s)
//           </Th>
//           <Th style={{ textAlign: "center" }} color="white">
//             <div>Lecture</div>
//             <div>Hours</div>
//           </Th>
//           <Th style={{ textAlign: "center" }} color="white">
//             <div>Lab</div>
//             <div>Hours</div>
//           </Th>
//           <Th style={{ textAlign: "center" }} color="white">
//             <div>Course</div>
//             <div>Credit</div>
//           </Th>
//           <Th style={{ textAlign: "center" }} color="white">
//             Grades
//           </Th>
//           <Th style={{ textAlign: "center" }} color="white">
//             Remarks
//           </Th>
//         </Tr>
//       </Thead>
//       <Tbody>
//         {course.length === 0 ? (
//           <Tr>
//             <Td colSpan={8} textAlign="center">
//               No courses available for this semester
//             </Td>
//           </Tr>
//         ) : (
//           course.map((courseItem) => (
//             <Tr key={courseItem.id}>
//               <Td fontSize="14px">{courseItem.course_code}</Td>
//               <Td className="course-title-cell" fontSize="14px">
//                 {courseItem.course_title}
//               </Td>
//               <Td
//                 fontSize="14px"
//                 style={{
//                   textAlign: "center",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 {renderPrerequisites(courseItem.pre_requisite)}
//               </Td>
//               <Td fontSize="14px" style={{ textAlign: "center" }}>
//                 {courseItem.num_lecture}
//               </Td>
//               <Td fontSize="14px" style={{ textAlign: "center" }}>
//                 {courseItem.num_lab}
//               </Td>
//               <Td fontSize="14px" style={{ textAlign: "center" }}>
//                 {courseItem.credit_unit}
//               </Td>
//               <Td>
//                 <Select
//                   placeholder="Grades"
//                   focusBorderColor="white"
//                   opacity=".6"
//                   w="6rem"
//                   fontSize=".7rem"
//                   fontWeight="semibold"
//                   fontFamily="inter"
//                   bgColor="#EEEEEE"
//                   color="black"
//                   textAlign="center"
//                   value={selectedGrades[courseItem.course_code] || ""}
//                   onChange={(e) =>
//                     handleGradeSelection(
//                       courseItem.course_code,
//                       parseFloat(e.target.value)
//                     )
//                   }
//                 >
//                   <option style={{ color: "black" }} value="1.00">
//                     1.00
//                   </option>
//                   {/* Add more grade options */}
//                 </Select>
//               </Td>
//               <Td fontSize="13px" fontStyle="bitter">
//                 {calculateRemarks(selectedGrades[courseItem.course_code])}
//               </Td>
//             </Tr>
//           ))
//         )}
//       </Tbody>
//       <Tfoot h="2.5rem" bgColor="#F0EEED" colSpan="5" textAlign="center">
//         <Tr>
//           {/* Footer row */}
//           {/* ... */}
//           <Th></Th>
//           <Th fontSize="13px" style={{ textAlign: "center" }}>
//             Total
//           </Th>
//           <Th></Th>
//           <Th fontSize="13px" style={{ textAlign: "center" }}>
//             {/* {totalLectureHours} */}
//           </Th>
//           <Th fontSize="13px" style={{ textAlign: "center" }}>
//             {/* {totalLabHours} */}
//           </Th>
//           <Th fontSize="13px" style={{ textAlign: "center" }}>
//             {/* {totalCourseCredits} */}
//           </Th>
//           <Th fontSize="13px" style={{ textAlign: "center" }}>
//             {/* {gwa} */}
//           </Th>
//           <Th></Th>
//         </Tr>
//       </Tfoot>
//     </Table>
//   );
// }

// CourseTable.propTypes = {
//   course: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       course_code: PropTypes.string.isRequired,
//       course_title: PropTypes.string.isRequired,
//       pre_requisite: PropTypes.string,
//       num_lecture: PropTypes.number.isRequired,
//       num_lab: PropTypes.number.isRequired,
//       credit_unit: PropTypes.number.isRequired,
//     })
//   ).isRequired,
//   courseYear: PropTypes.number.isRequired,
//   courseSemester: PropTypes.string.isRequired,
// };

// export default CourseTable;

import { Box } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loading from "./components/loading";

import Admin from "./pages/admin/admin";
import CurriculumUpload from "./pages/admin/pages/CurriculumUpload";
import FacultyUpload from "./pages/admin/pages/FacultyUpload";
import { Home } from "./pages/home/home";
import { UserContextProvider } from "./pages/routes/UserContext";

// Lazy load
const StudentSignIn = lazy(() =>
  import("./pages/student/components/studentSignin")
);
const AdminUser = lazy(() => import("./pages/admin/adminuser"));
const Evaluation = lazy(() => import("./pages/student/evaluation/evaluation"));
const Curriculum = lazy(() => import("./pages/student/curriculum/curriculum"));
const StudentAnalytics = lazy(() =>
  import("./pages/faculty/evaluation/usersEvaluation/studentAnalytics")
);
const FacultyHome = lazy(() => import("./pages/faculty/Home/FacultyHome"));
const StudentDashboard = lazy(() =>
  import("./pages/student/dashboard/studentDashboard")
);
const FacultyDashboard = lazy(() =>
  import("./pages/faculty/curriculum/facultyDashboard")
);
const FacultyEvaluation = lazy(() =>
  import("./pages/faculty/evaluation/evaluation")
);
const UsersEvaluation = lazy(() =>
  import("./pages/faculty/evaluation/usersEvaluation/usersEvaluation")
);
const UsersData = lazy(() => import("./pages/faculty/userData/usersData"));
const Terms = lazy(() => import("./components/footer/terms/terms"));
const Policy = lazy(() =>
  import("./components/footer/privacyPolicy/privacyPolicy")
);
const UserProfile = lazy(() => import("./pages/student/Studentuser/user"));
const FacultyUserProfile = lazy(() =>
  import("./pages/faculty/FacultyUserProfile/facultyuser")
);


function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/studentSignIn"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <StudentSignIn />
              </Suspense>
            }
          />
          <Route
            path="/policy"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <Policy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <Terms />
              </Suspense>
            }
          />
          {/* student's route */}
          <Route
            path="/studentdashboard"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <StudentDashboard />
              </Suspense>
            }
          />
          <Route
            path="/curriculum"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <Curriculum />
              </Suspense>
            }
          />

          <Route
            path="/userProfile"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <UserProfile />
              </Suspense>
            }
          />
          <Route
            path="/facultyuserProfile"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <FacultyUserProfile />
              </Suspense>
            }
          />

          <Route
            path="/analysis"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <Evaluation />
              </Suspense>
            }
          />
          {/* faculty routes */}
          <Route
            path="/facultyHome"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <FacultyHome />
              </Suspense>
            }
          />

          <Route
            path="/usersevaluation"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <UsersEvaluation />
              </Suspense>
            }
          />
          <Route
            path="/student-analytics"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <StudentAnalytics />
              </Suspense>
            }
          />
          <Route
            path="/facultydashboard"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <FacultyDashboard />
              </Suspense>
            }
          />
          <Route
            path="/facultyevaluation"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <FacultyEvaluation />
              </Suspense>
            }
          />
          <Route
            path="/usersdata"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <UsersData />
              </Suspense>
            }
          />
          {/* Admin */}
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <Admin />
              </Suspense>
            }
          />
          <Route
            path="/adminuser"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <AdminUser />
              </Suspense>
            }
          />
          <Route
            path="/curriupload"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <CurriculumUpload />
              </Suspense>
            }
          />
          <Route
            path="/facultyupload"
            element={
              <Suspense
                fallback={
                  <Box h="100vh" w="100%" position="absolute">
                    <Loading />
                  </Box>
                }
              >
                <FacultyUpload />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;

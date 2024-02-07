import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./home.css";

import PUP from "../../assets/IBITS.png";
import Square from "../../components/shapes/square";
import Triangle from "../../components/shapes/triangle";
import FacultySignIn from "../faculty/components/facultySignin";
import StudentSignIn from "../student/components/studentSignin";
import HomeButtons from "./components/buttons/buttons";

export const Home = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [showFacultySignIn, setShowFacultySignIn] = useState(false);
  const [showStudentSignIn, setShowStudentSignIn] = useState(false);

  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // function to change the shape
  const toggleShapeAndSignIn = (type) => {
    if (isDesktop) {
      setShowSquare(!showSquare); // Toggle the shape only on desktop
    }
    setShowFacultySignIn(type === "faculty");
    setShowStudentSignIn(type === "student");
  };

  const imageWidth = useBreakpointValue({ base: "100%", lg: "55.5%" });

  useEffect(() => {
    setShowSquare(isMobile);
  }, [isMobile]);


  return (
    <Flex
      h="100vh"
      w="100%"
      justifyContent="center"
      overflow="hidden"
      position="absolute"
    >
      <Box
        className="image"
        pos="absolute"
        w={{
          base: "100%", // Set 100% width for base (mobile) size
          md: isMobile ? "100%" : imageWidth, // Adjust width for different screen sizes
        }} // Adjust width for different screen sizes
      h="100%"
        bgImage={`url(${PUP})`}
        bgRepeat="no-repeat"
        bgPos="center"
        bgSize={isMobile ? "cover" : "cover"} // Set bgSize to "cover" for mobile
        left="0"
        bottom="0"
        border="white"
        zIndex={-1}
        opacity="0.7"
        visibility={isMobile ? "visible" : "visible"}
      />

      <Box
        zIndex="3"
        pos="absolute"
        top={isMobile ? "0" : "10rem"}
        right={isMobile ? "0" : "10rem"} // Adjust the right spacing for mobile view
        left={isMobile ? "0" : "auto"}
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems={isMobile ? "center" : "center"} // Center items in mobile view
        justifyContent={isMobile ? "center" : "flex-start"} // Center items in mobile view
        maxW={isMobile ? "100%" : "30rem"} // Set the desired maximum width
        width="100%" // Stretch the width to 100%
      >
        {showFacultySignIn ? (
          <FacultySignIn />
        ) : showStudentSignIn ? (
          <StudentSignIn />
        ) : (
          <HomeButtons
            onFacultyClick={() => toggleShapeAndSignIn("faculty")}
            onStudentClick={() => toggleShapeAndSignIn("student")}
          />
        )}
      </Box>

      <Box
        position="absolute"
        top={0}
        right={0}
        width={0}
        height={0}
        transition="background-color 0.1s ease"
      >
        {showSquare ? <Square /> : <Triangle />}
      </Box>
    </Flex>
  );
};

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const handleBackToHome = () => {
    window.location.reload();
  };
  //for animation of error
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  function generateRandomPassword(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }
  const randomPassword = generateRandomPassword(12);

  const handleSend = async () => {
    if (!email) {
      setError("Please fill in all the fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");

      // Show a toast for invalid email format
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    try {
      const response = await fetch(`${endPoint}/checkEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        const { exists, first_name, last_name, student_number } = data;

        if (exists) {
          console.log("Name:", `${first_name} ${last_name}`);
          console.log("Student Number:", student_number);

          const emailResponse = await fetch(`${endPoint}/sendEmail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              subject: "PUPSCES Password Reset",
              text: `Hello ${first_name} ${last_name},\n\nBelow is your new password .\n\nPassword: ${randomPassword}`,
            }),
          });

          console.log("The user input email is:", email);
          console.log("Response from /sendEmail:", emailResponse);

          if (emailResponse.ok) {
            const updatedStudentData = {
              student_number: student_number,
              student_password: randomPassword,
            };

            const updateStudentResponse = await fetch(
              `${endPoint}/updatePassword`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedStudentData),
              }
            );

            if (updateStudentResponse.ok) {
              console.log("Password updated successfully.");
            } else {
              console.error("Error updating password.");
            }

            toast({
              title: "Success",
              description: "Password reset email sent successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Error",
              description: "Error sending the password reset email.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          setError("Email address is not registered.");
        }
      } else {
        toast({
          title: "Error",
          description: "Error checking email address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      console.log("Error checking email address:", error);
      console.log("An error occurred");
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box mr="0">
        <VStack align="flex-start" justifyContent="center">
          <Text fontSize="2rem" color="white" mb="2rem">
            Forgot Password
          </Text>
          <AnimatePresence>
            {error ? (
              <Center
                bg="#FAECD6"
                w="65.5%"
                p=".8rem"
                borderRadius=".3rem"
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
                color="palette.primary"
                fontWeight="inter"
                fontSize=".9rem"
                fontFamily="inter"
                textAlign="center"
              >
                {error}
              </Center>
            ) : null}
          </AnimatePresence>
          <Divider w="19rem" />
          <Input
            mt="2rem"
            placeholder="Email"
            p="1.5rem"
            // w="65.5%"
            focusBorderColor="palette.secondary"
            bg="palette.secondary"
            color="palette.primary"
            _placeholder={{
              color: "#5C596E",
              opacity: ".6",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            mt="2rem"
            w="100%"
            fontFamily="inter"
            bg="#FFF5E0"
            color="palette.primary"
            p="1.5rem"
            onClick={handleSend}
            loadingText="Processing..."
          >
            Send Password Reset
          </Button>
          <Divider mt="2rem" w="19rem" />
          <Text
            mt="10px"
            color="palette.secondary"
            onClick={handleBackToHome}
            cursor="pointer"
          >
            Back to Home
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
export default ForgotPassword;

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Text,
  VStack,

} from "@chakra-ui/react";

import { AnimatePresence, motion } from "framer-motion";
import {  useState } from "react";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error] = useState("");
 // const toast = useToast();

  const handleBackToHome = () => {
    window.location.reload(); // Reload the current page
  };

  // const handleSubmit = async () => {
  //   if (!email) {
  //     setError("Please enter your email");
  //     return;
  //   }

  //   try {
  //     await sendPasswordResetEmail(auth, email);

  //     console.log("Password reset email sent successfully");
  //     setEmail("");
  //     // Display the toast notification
  //     toast({
  //       position: "top",
  //       title: "Password Reset Sent",
  //       description: "Please check your email for a password reset link.",
  //       status: "success",
  //       duration: 5000,
  //       isClosable: true,
  //     });

  //     // Wait for the specified duration before reloading
  //     await new Promise((resolve) => setTimeout(resolve, 6000));

  //     // Reload the current page after the toast duration
  //     window.location.reload();
  //   } catch (error) {
  //     // Handle the error if email sending fails
  //     console.error("Error sending password reset email", error);
  //   }
  // };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setError("");
  //   }, 3000);

  //   return () => clearTimeout(timeout);
  // }, [error]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setError("");
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, [error]);

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box paddingTop="8rem" w="29rem">
        <VStack align="flex-start">
          <Text fontSize="2rem" color="white" mb="2rem">
            Forgot Password
          </Text>
          <AnimatePresence>
            {error ? (
              <Center
                bg="#83BF6D"
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
            w="65.5%"
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
            w="65.5%"
            fontFamily="inter"
            bg="#FFF5E0"
            color="palette.primary"
            p="1.5rem"
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

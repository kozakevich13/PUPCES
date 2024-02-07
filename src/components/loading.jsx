import { Grid } from "@chakra-ui/react";
import Lottie from "react-lottie-player";
import LoadingAnimation from "../assets/loading.json";

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Grid h="100vh" placeContent="center">
        <Lottie
          loop
          animationData={LoadingAnimation}
          play
          style={{ width: 250, height: 250 }}
        />
      </Grid>
    </div>
  );
}

export default Loading;

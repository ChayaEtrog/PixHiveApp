import { Box } from "@mui/material";
import pixHive from "../../public/pictures/PixHive.png"
import pixHiveLogedin from "../../public/pictures/PixHiveLogedCut.png"
import { UserContext } from "./user/UserReducer";
import AuthModalManager from "./user/AuthModelManager";
import { useContext } from "react";
import HomePage from "./homePage";
function Home() {
  const { user } = useContext(UserContext);
  return (
    <>
      {(user.email == '') &&
        <>
          <Box sx={{
            backgroundImage: `url(${pixHive})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
            overflow: "hidden"
          }}>
            <AuthModalManager/>
          </Box>
        </>
      }
      {
        (user.email != '') &&
        <Box sx={{height:'100%',overflow:'auto'}}>
        <Box sx={{
          backgroundImage: `url(${pixHiveLogedin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}>   </Box>
      <HomePage/>
        </Box>
      }

    </>)
}

export default Home;
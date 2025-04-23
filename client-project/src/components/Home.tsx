import { Box, Button } from "@mui/material";
import pixHive from "../../public/pictures/PixHive.png"
import pixHiveLogedin from "../../public/pictures/PixHiveLogedCut.png"
import { useContext, useState } from "react";
import Login from "./user/UserLogin";
import Register from "./user/UserRegister";
import { UserContext } from "./user/UserReducer";
function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            <Box
              sx={{
                position: "absolute",
                right: "20%",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Button
                onClick={() => setIsLoginOpen(true)}
                sx={{
                  backgroundColor: "white",
                  color: ' #b09def',
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}>
                LOGIN
              </Button>

              <Button variant="outlined"
                onClick={() => setIsRegisterOpen(true)}
                sx={{
                  width: '300px',
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}>
                SIGNUP
              </Button>
            </Box>
          </Box>
        </>
      }
      {
        (user.email != '') &&
        <Box sx={{
          backgroundImage: `url(${pixHiveLogedin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}>   </Box>
      }

      {(isLoginOpen) && (
        <Login open={isLoginOpen} close={setIsLoginOpen} />
      )}

      {(isRegisterOpen) && (
        <Register open={isRegisterOpen} close={setIsRegisterOpen}  />
      )}
    </>)
}

export default Home;
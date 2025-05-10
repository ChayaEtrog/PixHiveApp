import  { useState } from 'react';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import { Box, Button } from '@mui/material';

const AuthModalManager = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <>
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
            
            <UserLogin
                open={isLoginOpen}
                close={setIsLoginOpen}
            />

            <UserRegister
                open={isRegisterOpen}
                close={setIsRegisterOpen}
                switchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </>
    );
};

export default AuthModalManager;
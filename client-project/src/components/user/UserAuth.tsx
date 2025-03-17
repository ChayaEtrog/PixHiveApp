import { useState } from "react";
import { Button, Grid2 } from "@mui/material";
import Login from "./UserLogin";
import UserAvatar from "./UserAvatar";
import Register from "./UserRegister";

function UserAuth() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [typeOfButton, setTypeOfButton] = useState('');

    return (
        <>
            <Grid2 container spacing={3} justifyContent="flex-start" alignItems="flex-start" sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}>
                {!isLogedIn && (
                    <div>
                        <Button onClick={() => { setIsModalOpen(true); setTypeOfButton('REGISTER') }} variant="outlined" sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(10, 3, 3, 0.67)',
                                borderColor: 'rgb(209, 188, 144)',
                            },
                            borderRadius: 6
                        }}>
                            sign up
                        </Button>

                        <Button onClick={() => { setIsModalOpen(true); setTypeOfButton('LOGIN') }} variant="outlined" sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            borderColor: 'rgb(163, 163, 163)',
                            marginLeft: '16px',
                            '&:hover': {
                                backgroundColor: 'rgba(220, 219, 219, 0.46)',
                                borderColor: 'rgb(209, 188, 144)',
                            },
                            borderRadius: 6
                        }}>
                            Log in
                        </Button>
                    </div>
                )}

                {isLogedIn && (<UserAvatar />)}
            </Grid2>

            {(isModalOpen && typeOfButton == "LOGIN") && (
                <Login open={isModalOpen} close={setIsModalOpen} setIsLogedIn={(setIsLogedIn)} />
            )}

            {(isModalOpen && typeOfButton == "REGISTER") && (
                <Register open={isModalOpen} close={setIsModalOpen} setIsLogedIn={(setIsLogedIn)} />
            )}
        </>
    );
}

export default UserAuth;
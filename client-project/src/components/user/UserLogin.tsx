import { FormEvent, useContext, useRef, useState } from "react";
import { User } from "../../types/User";
import { emptyUser, UserContext } from "./UserReducer";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import ErrorMessage from "../ErrorMessage";
import CloseIcon from '@mui/icons-material/Close';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ open, close, setIsLogedIn }: { open: boolean, close: Function, setIsLogedIn: Function }) => {
    const { userDispatch } = useContext(UserContext);
    const [userData, setUserData] = useState<User>(emptyUser);
    const [isSubmitOk, setIsSubmitOk] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uri = 'api/auth/login';
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleInputChange = () => {
        const emailValue = emailRef.current?.value || '';
        const isEmailValid = emailRegex.test(emailValue);
        const isPasswordValid = passwordRef.current?.checkValidity() ?? false;

        setIsSubmitOk(!(isEmailValid || emailValue) || !isPasswordValid);
    };

    const handleChange = (key: string, value: string) => {
        setUserData({ ...userData, [key]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/${uri}`, {
                userNameOrEmail: emailRef.current?.value || "",
                password: passwordRef.current?.value || "",
            });

            const data = response.data;

            userDispatch({
                type: 'CREATE_USER',
                data: {
                    id: data.user.id,
                    userName: data.user.userName,
                    email: data.user.email,
                    phonNumber: data.user.phonNumber
                },
            });

            setUserData(emptyUser);
            setIsLogedIn(true);
            close(false);

        } catch (e: any) {
            console.log(e.response.data);
            setError(e.response.data)
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#f9f9f9',
        borderRadius: '16px',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <>
            {(error) && <ErrorMessage message={error} setError={setError} />}

            <Modal open={open} onClose={() => { close(false) }}>
                <Box sx={style} >

                <IconButton sx={{position: 'absolute', top: 8, right: 8, color: 'red' }} onClick={() => close(false)}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    <LockOpenRoundedIcon sx={{fontSize:'40px'}}/>
                </Typography>

                <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Log In
                </Typography>

                    <TextField label="EmailOrUserName" type='text' inputRef={emailRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} onChange={(e) => handleChange(e.target.id, e.target.value)} />

                    <TextField label="Password" type='password' inputRef={passwordRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} onChange={(e) => handleChange(e.target.id, e.target.value)} />

                    <div > <Button onClick={handleSubmit} variant="outlined" disabled={isSubmitOk}>Submit</Button></div>
                </Box>
            </Modal >
        </>
    );
};

export default Login;
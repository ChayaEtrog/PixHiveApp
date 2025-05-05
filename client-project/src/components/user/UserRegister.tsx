import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserReducer";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import ErrorMessage from "../ErrorMessage";
import CloseIcon from '@mui/icons-material/Close';
import { registerUser } from "./UserService";
import lock from "../../../public/Icons/lock.png"
import { gradientBorderButton } from "../../styles/buttonsStyle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = ({ open, close }: { open: boolean, close: Function }) => {
    const { userDispatch } = useContext(UserContext);
    const [isSubmitOk, setIsSubmitOk] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uri = '/auth/register';
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const phonNumberRef = useRef<HTMLInputElement>(null);

    const handleInputChange = () => {
        const emailValue = emailRef.current?.value || '';
        const isEmailValid = emailRegex.test(emailValue);
        const isPasswordValid = passwordRef.current?.checkValidity() ?? false;
        const isNameValid=userNameRef.current?.checkValidity()??false;
        const isPhoneNumberValid = phonNumberRef.current?.checkValidity()?? false;

        setIsSubmitOk(!(isEmailValid && isPasswordValid && isNameValid && isPhoneNumberValid));
    };
    
    useEffect(() => {
        handleInputChange()
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = await registerUser(
                emailRef.current?.value || "",
                passwordRef.current?.value || "",
                userNameRef.current?.value || "",
                phonNumberRef.current?.value || "",
                API_BASE_URL,
                uri
            );
    
            userDispatch({
                type: 'CREATE_USER',
                data: {
                    id: data.user.id,
                    userName: data.user.userName,
                    email: data.user.email,
                    phoneNumber: data.user.phoneNumber
                },
            });

            close(false);
    
        } catch (error:any) {
            console.log(error);
            setError(error);
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

                    <IconButton sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }} onClick={() => close(false)}>
                        <CloseIcon />
                    </IconButton>

                    <img src={lock} alt="" style={{width:'80px'}}/>

                    <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Sign Up
                    </Typography>

                    <TextField label="Email" type='text' inputRef={emailRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                    <TextField label="Password" type='password' inputRef={passwordRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                    <TextField label="UserName" type='text' inputRef={userNameRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                    <TextField label="PhoneNumber" type='text' inputRef={phonNumberRef} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange}/>

                    <Button onClick={handleSubmit} sx={gradientBorderButton} disabled={isSubmitOk} style={{marginTop:'22px'}}>Submit</Button>
                </Box>
            </Modal >
        </>
    );
};

export default Register;
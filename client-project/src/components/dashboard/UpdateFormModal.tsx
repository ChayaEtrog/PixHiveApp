import { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import ErrorMessage from "../ErrorMessage";
import { UserContext } from "../user/UserReducer";
import { UserPostModal } from "../../types/User";
import { updateUser } from "../user/UserService";
import CloseIcon from '@mui/icons-material/Close';
import { gradientBorderButton } from "../../styles/buttonsStyle";
import editUser from'../../../public/Icons/edit.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function FormModel({ setIsOpen }: { setIsOpen: Function }) {
    const { user, userDispatch} = useContext(UserContext);
    const [isSubmitOk, setIsSubmitOk] = useState(false);
    const [open, setOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

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
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const handleInputChange = () => {
        const emailValue = emailRef.current?.value || '';
        const isEmailValid = emailRegex.test(emailValue);
        const isNameValid=userNameRef.current?.checkValidity()??false;
        const isPhoneNumberValid = phoneRef.current?.checkValidity()?? false;

        setIsSubmitOk(!(isEmailValid && isNameValid && isPhoneNumberValid));
    };

    useEffect(() => {
        setIsSubmitOk(!(user.email));
    }, []);

    const handleSubmit = async () => {
        let newUserData:UserPostModal= {
            userName: userNameRef.current?.value || "",
            email: emailRef.current?.value || "",
            phoneNumber: phoneRef.current?.value || "",
        };

        try {
            const result = await updateUser(user.id, newUserData, API_BASE_URL);
        
            userDispatch({ type: "UPDATE_USER", data: newUserData });
        
            console.log("user updated succefully", result);
            setIsOpen(false)
          } catch (error) {
            setError("an error accured, user wasnt updted")
          }
    };

    return <>
        {(error) && <ErrorMessage message={error} setError={setError} />}

        <Modal open={open} onClose={() => { setIsOpen(false),setOpen(false) }}>
                    <Box sx={style} >

                        <IconButton sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }} onClick={() => setIsOpen(false)}>
                            <CloseIcon />
                        </IconButton>

                        <img src={editUser} alt="" style={{width:'80px'}}/>

                        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                            Update
                        </Typography>

                        <TextField label="Name" type='text' inputRef={userNameRef}  defaultValue={user.userName} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                        <TextField label="Email" type='email' inputRef={emailRef} defaultValue={user.email} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                        <TextField label="PhonNumber" type='tel' inputRef={phoneRef} defaultValue={user.phoneNumber} margin="normal" variant="outlined" fullWidth required onInput={handleInputChange} />

                        <div > <Button onClick={handleSubmit} disabled={isSubmitOk} sx={gradientBorderButton} style={{marginTop:'15px'}}>Submit</Button></div>
                    </Box>
                </Modal >
    </>
}

export default FormModel;
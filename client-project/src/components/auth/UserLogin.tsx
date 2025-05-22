import { useContext, useState } from "react";
import { UserContext } from "../user/UserReducer";
import { Box, Button, CircularProgress, IconButton, Modal, TextField, Typography } from "@mui/material";
import ErrorMessage from "../ErrorMessage";
import CloseIcon from '@mui/icons-material/Close';
import lock from "../../../public/Icons/lock.png"
import { loginUser } from "../user/UserService";
import { gradientBorderButton } from "../../styles/buttonsStyle";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const schema = yup.object().shape({
    emailOrUserName: yup.string().required('Required'),
    password: yup.string().required('Required'),
});

const UserLogin = ({ open, close }: { open: boolean, close: Function }) => {
    const { userDispatch } = useContext(UserContext);
    const [error, setError] = useState<string | null>(null);
const[loading, setLoading]=useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const onSubmit = async (data: { emailOrUserName: string; password: string }) => {
        setLoading(true)
        try {
            const result = await loginUser(data.emailOrUserName, data.password, API_BASE_URL, 'auth/login');
            userDispatch({
                type: 'CREATE_USER',
                data: {
                    id: result.user.id,
                    userName: result.user.userName,
                    email: result.user.email,
                    phoneNumber: result.user.phoneNumber,
                },
            });
            close(false);
        } catch (error: any) {
            setError(error.message || 'Login failed');
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
            {error && <ErrorMessage message={error} setError={setError} />}

            <Modal open={open} onClose={() => close(false)}>
                <Box sx={style}>
                    <IconButton sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }} onClick={() => close(false)}>
                        <CloseIcon />
                    </IconButton>

                    <img src={lock} alt="" style={{ width: '80px' }} />

                    <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Log In
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', flexDirection: 'column', display: "flex", alignItems: 'center' }}>
                        <TextField
                            label="EmailOrUserName"
                            fullWidth
                            margin="normal"
                            {...register('emailOrUserName')}
                            error={!!errors.emailOrUserName}
                            helperText={errors.emailOrUserName?.message}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            sx={{ ...gradientBorderButton, mt: 3 }}
                            disabled={!isValid||loading}
                            fullWidth
                        >
                            {loading ? (
                                <>
                                    <svg width={0} height={0}>
                                        <defs>
                                            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#e01cd5" />
                                                <stop offset="100%" stopColor="#1CB5E0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <CircularProgress size={24} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default UserLogin;
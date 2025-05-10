import { useContext, useState } from "react";
import { UserContext } from "./UserReducer";
import { Box, Button, CircularProgress, IconButton, Link, Modal, TextField, Typography } from "@mui/material";
import ErrorMessage from "../ErrorMessage";
import CloseIcon from '@mui/icons-material/Close';
import { registerUser } from "./UserService";
import lock from "../../../public/Icons/lock.png"
import { gradientBorderButton } from "../../styles/buttonsStyle";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().required('Required'),
    userName: yup.string().required('Required'),
    phoneNumber: yup.string().required('Required'),
});

const UserRegister = ({
    open,
    close,
    switchToLogin,
}: {
    open: boolean;
    close: Function;
    switchToLogin: () => void;
}) => {
    const { userDispatch } = useContext(UserContext);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const onSubmit = async (data: {
        email: string;
        password: string;
        userName: string;
        phoneNumber: string;
    }) => {
        setLoading(true)
        try {
            const result = await registerUser(
                data.email,
                data.password,
                data.userName,
                data.phoneNumber,
                API_BASE_URL,
                '/auth/register'
            );

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
            setError(error.message || 'Registration failed');
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

                    <img src={lock} alt="lock" style={{ width: '80px' }} />

                    <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Sign Up
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', flexDirection: 'column', display: "flex", alignItems: 'center' }}>
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
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

                        <TextField
                            label="UserName"
                            fullWidth
                            margin="normal"
                            {...register('userName')}
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                        />

                        <TextField
                            label="PhoneNumber"
                            fullWidth
                            margin="normal"
                            {...register('phoneNumber')}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                        />

                        <Button
                            type="submit"
                            sx={{ ...gradientBorderButton, mt: 3 }}
                            disabled={!isValid || loading}
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

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link
                            component="button"
                            onClick={switchToLogin}
                            underline="hover"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Log in
                        </Link>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default UserRegister;
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { createAlbum } from '../albums/albumSlice';
import { UserContext } from '../user/UserReducer';
import { useParams } from 'react-router';
import { AppDispatch } from '../appStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { gradientBorderButton, GradientButton } from '../../styles/buttonsStyle';

// הגדרת הסכימה של yup
const schema = yup.object().shape({
    albumName: yup.string().required("Album Name is required"),
});

// הגדרת הטיפוס של הנתונים בטופס
type FormData = {
    albumName: string;
};

const CreateAlbum = ({closeForm}:{closeForm:Function}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useContext(UserContext);
    const { albumId } = useParams();

    // יצירת useForm עם validation של yup
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        // אם albumId לא מוגדר, המערכת יוצרת אלבום חדש ללא הורה, אחרת עם ה-ID של ההורה
        if (albumId === undefined) {
            closeForm(false)
            dispatch(createAlbum({ albumName: data.albumName, userId: user.id, parentId: null }));
        } else {
            closeForm(false)
            dispatch(createAlbum({ albumName: data.albumName, userId: user.id, parentId: +albumId }));
        }
    };

    return (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: "100vh",
                backgroundColor: "rgba(95, 94, 94, 0.48)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
              onClick={() => closeForm(false)}
            >
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  backgroundColor: "white",
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  width: "350px",
                }}
                onClick={(e)=>e.stopPropagation()}
              >
                <Typography variant="h5" mb={2}>
                  new Album
                </Typography>
        
                <TextField
                  label="Album Name"
                  defaultValue={"new Album"}
                  fullWidth
                  {...register("albumName")}
                  error={!!errors.albumName}
                  helperText={errors.albumName?.message}
                />
        
                <Button
                  type="submit"
                  sx={GradientButton}
                  style={{width: "48%" ,marginRight:'4px', marginTop: '20px'}}
                >
                  Create 
                </Button>
                <Button
                  sx={gradientBorderButton}
                  style={{width:'48% !important', marginTop: '20px'}}
                  onClick={()=>closeForm(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
    );
};

export default CreateAlbum;


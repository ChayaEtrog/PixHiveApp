import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { UserContext } from '../../user/UserReducer';
import { AppDispatch } from '../../appStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { gradientBorderButton, GradientButton } from '../../../styles/buttonsStyle';
import { updateFileName } from '../imageSlice';

const schema = yup.object().shape({
  newName: yup.string().required("Image Name is required"),
});

type FormData = {
  newName: string;
};

const RenameImage = ({ oldName, fileId, closeForm }: { oldName: string, closeForm: Function, fileId: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(UserContext);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await dispatch(updateFileName({
        newName: data.newName,
        fileId: fileId,
        userId: user.id
      })).unwrap(); 

      closeForm(false);
    } catch (error) {
      console.error("Error updating file name:", error);
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
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h5" mb={2}>
          Rename Image
        </Typography>

        <TextField
          label="Image Name"
          defaultValue={oldName}
          fullWidth
          {...register("newName")}
          error={!!errors.newName}
          helperText={errors.newName?.message}
        />

        <Button
          type="submit"
          sx={GradientButton}
          style={{ width: "48%", marginRight: '4px', marginTop: '20px' }}
        >
          Rename
        </Button>
        <Button
          sx={gradientBorderButton}
          style={{ width: '48% ', marginTop: '20px' }}
          onClick={() => closeForm(false)}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default RenameImage;


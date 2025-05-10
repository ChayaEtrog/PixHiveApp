import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

function ErrorMessage({ message, setError }: { message: string, setError?:Function }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={() =>{setOpen(false);setError?.(null);}}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="error"
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ErrorMessage;
import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

function AlertMessage({ message, setMessage }: { message: string, setMessage?:Function }) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={() =>{setOpen(false);setMessage?.(null);}}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{ zIndex: 1500 }}
    >
      <Alert
        onClose={() => setOpen(false)}
        sx={{
          border:'0.1px solid rgba(0, 0, 0, 0.06)',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;
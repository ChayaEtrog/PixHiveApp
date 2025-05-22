import { useState } from 'react';
import { Box, Fab, Paper, TextField, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { postMessage } from './messageSlice';
import { MessagePostModel } from '../../types/MessagePostModel';
import messages from'../../assets/Icons/messages.png'
import send from '../../assets/Icons/send.png'
const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<MessagePostModel>({message:'',senderId:-1,receiverId:-1,isActive:true});
  const dispatch = useDispatch<AppDispatch>();

  const handleSend = () => {
    if (message.message.trim()) {
      dispatch(postMessage(message));
      setMessage({message:'',senderId:-1,receiverId:-1,isActive:true});
      setOpen(false);
    }
  };

  const handleChangeMessage=(e:any)=>{
    const storedUser = sessionStorage.getItem('user');
    const parsedUser = storedUser?JSON.parse(storedUser):null
    setMessage({message:e, senderId:parsedUser?.id,receiverId:1,isActive:true})
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 26, right: 30, zIndex: 1000 }}>
      {open && (
        <Paper
        elevation={6}
        sx={{
          mb: 1,
          pt: 6,
          px: 2,
          pb: 2,
          width: 300,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          border: '1px solid #ccc',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#fdfdfd',
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            color:'red'
          }}
        >
          ✖
        </IconButton>
      
        <TextField
          multiline
          fullWidth
          minRows={3}
          placeholder="write a message to admin"
          value={message.message}
          onChange={(e) => handleChangeMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton color="primary" onClick={handleSend}>
                <img src={send} alt="send" style={{ width: 24, height: 24 }} />
              </IconButton>
            ),
            sx: {
              alignItems: 'flex-end',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: '#fff',
            },
          }}
        />
      </Paper>
      )}
     {!open&& <Fab
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{
          width: 60,
          height: 60,
          backgroundColor:'white',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', 
        }}
      >
        <img src={messages} alt="" width={45}/>
      </Fab>}
    </Box>
  );
};

export default ChatBubble;

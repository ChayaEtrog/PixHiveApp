import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMessages, markMessageAsRead } from "./messageSlice"; 
import { AppDispatch, StoreType } from "../appStore";
import { UserContext } from "../user/UserReducer";
import bell from "../../../public/Icons/bell2.png"
import notRead from "../../../public/Icons/MessageNotRead.png"
import { Box, Button, CircularProgress } from "@mui/material";
import { gradientBorderButton } from "../../styles/buttonsStyle";
import ChatBubble from "./ChatBubble";
import ErrorMessage from "../ErrorMessage";

const MessageBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(UserContext);

  const { messages, loading, error } = useSelector((store: StoreType) => store.messages);
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  const [visibleMessages, setVisibleMessages] = useState(6);

  const loadMoreMessages = () => {
    setVisibleMessages((prev) => prev + 6);
  };

  useEffect(() => {
    dispatch(fetchUserMessages(user.id));
  }, [dispatch]);

  const handleMarkAsRead = (messageId: number) => {
    dispatch(markMessageAsRead({ userId: user.id, messageId: messageId }));
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.6)', 
            zIndex: 9999,
          }}
        >
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e01cd5" />
                <stop offset="100%" stopColor="#1CB5E0" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress
            sx={{
              width: '100px !important',
              height: '100px !important',
              'svg circle': {
                stroke: 'url(#my_gradient)',
              },
            }}
          />
        </Box>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start", height: "90vh", overflowY: "auto", marginTop: "75px" }}>
          <div
            style={{
              width: "40px",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              right: "15px",
              top: "100px",
              height: "40px",
              borderRadius: "50%",
            }}
          >
            <img src={bell} alt="" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  backgroundColor: "rgba(254, 24, 24, 0.78)",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "12px",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          <div style={{ padding: "10px", marginTop: "10px", marginBottom: "75px" }}>
            {messages.slice(0, visibleMessages).map((message) => (
              <div
                key={message.id}
                style={{
                  maxWidth: "80vw",
                  width: "max-content",
                  minWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: message.isRead ? "rgba(241, 241, 241, 0.71)" : "rgba(232, 240, 254, 0.87)",
                  marginBottom: "30px",
                  borderRadius: "5px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
                onClick={() => handleMarkAsRead(message.id)}
              >
                <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "gray", marginRight: "8px" }}>
                    {new Date(message.createdAt).toLocaleDateString("he-IL")}
                  </span>
                  {!message.isRead && <img src={notRead} alt="" style={{ width: "30px", height: "30px", objectFit: "cover",cursor:'pointer' }} />}
                </div>
                <p style={{ marginTop: "5px" }}>{message.message}</p>
              </div>
            ))}

            {visibleMessages < messages.length && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button onClick={loadMoreMessages} sx={gradientBorderButton}>
                  load more
                </Button>
              </Box>
            )}
          </div>
          <ChatBubble />
          {error && <ErrorMessage message={error} />}
        </div>
      )}
    </>
  );
}
export default MessageBox

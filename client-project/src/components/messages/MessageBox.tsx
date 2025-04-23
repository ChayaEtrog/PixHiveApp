import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMessages, markMessageAsRead } from "./messageSlice"; // יבוא הפונקציות
import { AppDispatch, StoreType } from "../appStore";
import { UserContext } from "../user/UserReducer";
import bell from "../../../public/Icons/bell2.png"
import notRead from "../../../public/Icons/MessageNotRead.png"

const MessageBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useContext(UserContext);

  // Get messages and unread count from the Redux store
  const { messages, loading, error } = useSelector((store:StoreType) => store.messages);
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  // Fetch messages when component mounts
  useEffect(() => {
    dispatch(fetchUserMessages(user.id));
  }, [dispatch]);

  // Mark a message as read
  const handleMarkAsRead = (messageId:number) => {
    dispatch(markMessageAsRead({userId: user.id, messageId: messageId }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "90vh", overflowY: "auto",  marginTop: "75px"  }}>
      {/* Right side: Bell icon for unread messages count */}
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
  
      <div style={{ padding: "10px",marginTop:'20px',marginBottom:'75px'}}>
        {messages.map((message) => (
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
              background: message.isRead ?"rgba(241, 241, 241, 0.71)" :"rgba(232, 240, 254, 0.87)", // Different background for unread
              marginBottom:"30px",
              borderRadius: "5px",
              cursor: "pointer",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
            onClick={() => handleMarkAsRead(message.id)}
          >
            <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "gray",marginRight:"8px" }}>{new Date(message.createdAt).toLocaleDateString("he-IL")}</span>
              {!message.isRead && <img src={notRead} alt="" style={{ width: "30px", height: "30px", objectFit: "cover" }} /> }
            </div>
            <p style={{ marginTop: "5px" }}>{message.message}</p>
          </div>
        ))}
        <div style={{ height: "10px" }}></div>
      </div>
    </div>
  );
}

export default MessageBox;

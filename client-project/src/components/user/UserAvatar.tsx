import { useContext } from "react";
import { UserContext } from "./UserReducer";
import { Avatar, Grid2, } from "@mui/material";

const UserAvatar = () => {
    const { user } = useContext(UserContext);
  
    return (
      <Grid2>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontSize: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              background: "linear-gradient(-45deg, #47dcd1, #dc8dec, #47dcd1, #dc8dec)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 10s ease infinite",
            }}
          >
            {user.email[0]}
          </Avatar>

        <style>
          {`
           @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          `}
        </style>
      </Grid2>
    );
  };
  
  export default UserAvatar;
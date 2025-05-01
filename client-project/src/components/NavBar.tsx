import { NavLink } from "react-router";
import { AppBar, Box, Toolbar } from "@mui/material";
import UserAvatar from "./user/UserAvatar";

function NavBar() {
    return (<>
        <AppBar
            position="fixed"
            sx={{
                top: 0,
                left: 0,
                right: 0,
                padding: '16px 0',
                backgroundColor: 'background.paper',
                zIndex: 1300,
                height: '80px',
                boxShadow: "none",
                borderBottom: "1px solid rgba(160, 159, 159, 0.42)"
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: "16px", textAlign: "right", alignItems: "center" }}>
                    <NavLink
                        to="/home"
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/upload-image"
                    >
                        Upload
                    </NavLink>

                    <NavLink
                        to="/gallery"
                    >
                        Gallery
                    </NavLink>

                    <NavLink
                        to="/messages"
                    >
                        System Messages
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                    >
                       Dashboard
                    </NavLink>

                    <NavLink
                        to="/collage"
                    >
                       create a collage
                    </NavLink>

                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <UserAvatar/>
                </Box>
            </Toolbar>
        </AppBar>

    </>)
}

export default NavBar;
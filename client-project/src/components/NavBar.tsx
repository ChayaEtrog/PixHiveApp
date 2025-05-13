import { NavLink } from "react-router";
import UserAvatar from "./user/UserAvatar";

import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import gallery from "../../public/Icons/imagesAndAlbums.png"
import mesages from "../../public/Icons/messages.png"
import dashboard from "../../public/Icons/userSettings.png"
import collage from "../../public/Icons/collage.png"
import home from "../../public/Icons/home.png"
import upload from "../../public/Icons/uploadIcon.png"
import { motion } from "framer-motion";

const NavBar=()=> {
    return (
        <AppBar
            position="fixed"
            sx={{
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: 'background.paper',
                zIndex: 1300,
                height: '75px',
                boxShadow: "none",
                display: 'flex',
                justifyContent: 'center',
                padding: '0 20px',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '0.3px', 
                    background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)', // תוכלי לשנות את הצבעים
                }
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>

                {/* Left - Home */}
                <NavLink to="/home" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={home} alt="" style={{ width: '45px', objectFit: 'cover' }} />
                    </Box>
                </NavLink>

                {/* Center - Nav Links */}
                <Box sx={{ display: "flex", gap: 7, justifyContent: "center", alignItems: "center" }}>


                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        whileHover={{
                            y: [0, -3, 0, -2, 0],
                            transition: { duration: 0.7 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink to="/upload-image" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={upload} alt="" style={{ width: '35px', objectFit: 'cover' }} />
                                <Typography variant="caption" color="gray">Upload</Typography>
                            </Box>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        whileHover={{
                            y: [0, -3, 0, -2, 0],
                            transition: { duration: 0.7 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink to="/gallery" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={gallery} alt="" style={{ width: '35px', objectFit: 'cover' }} />
                                <Typography variant="caption" color="gray">Gallery</Typography>
                            </Box>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        whileHover={{
                            y: [0, -3, 0, -2, 0],
                            transition: { duration: 0.7 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink to="/messages" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={mesages} alt="" style={{ width: '35px', objectFit: 'cover' }} />
                                <Typography variant="caption" color="gray">Messages</Typography>
                            </Box>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        whileHover={{
                            y: [0, -3, 0, -2, 0],
                            transition: { duration: 0.7 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink to="/dashboard" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={dashboard} alt="" style={{ width: '35px', objectFit: 'cover' }} />
                                <Typography variant="caption" color="gray">Dashboard</Typography>
                            </Box>
                        </NavLink>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        whileHover={{
                            y: [0, -3, 0, -2, 0],
                            transition: { duration: 0.7 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink to="/collage" style={{ textAlign: "center", textDecoration: "none", color: 'inherit' }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <img src={collage} alt="" style={{ width: '35px', objectFit: 'cover' }} />
                                <Typography variant="caption" color="gray">Collage</Typography>
                            </Box>
                        </NavLink>
                    </motion.div>
                </Box>

                <Box>
                    <UserAvatar />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
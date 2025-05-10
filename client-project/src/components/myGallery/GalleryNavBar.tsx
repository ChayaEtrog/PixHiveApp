import { Box, Button, IconButton } from "@mui/material";
import addAlbum from "../../../public/Icons/addAlbum.png"
import { gradientBorderButton, iconButtonStyle } from "../../styles/buttonsStyle";
import { useState } from "react";
import CreateAlbum from "../albums/CreateAlbum";
import UploadImagePopup from "../images/UploadImagePopup";
import upload from "../../../public/Icons/uploadIcon.png"
import recycleBin from "../../../public/Icons/recycleBin.png"
import { useNavigate } from "react-router";
import gallery from "../../../public/Icons/imagesAndAlbums.png"
import { motion } from 'framer-motion';
import arrowRight from "../../../public/Icons/simpleArrowRight.png"
import arrowLeft from"../../../public/Icons/arrowLeft.png"
import Divider from '@mui/material/Divider';

const GalleryNavBar = () => {
    const [createAlbum, setCreateAlbum] = useState(false);
    const [uploadImage, setUploadImage] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleCollapse = () => setCollapsed((prev) => !prev);

    return (
        <motion.div
            animate={{ width: collapsed ? 75 : 225 }}
            transition={{ duration: 0.4 }}
            style={{
                marginTop: "80px",
                height: "88vh",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "#fff",
                boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                paddingTop: "10px",
                overflowX: "hidden",
                zIndex: 1000,
            }}
        >
            <IconButton onClick={toggleCollapse} sx={{ mb: 1,mr:1}}>
                {collapsed ? <img src={arrowRight} style={{width:'30px',objectFit:'cover'}}  /> : <img src={arrowLeft} style={{width:'30px',objectFit:'cover'}} /> }
            </IconButton>
            <Divider flexItem sx={{mb:2}}/>
            <Box sx={{ height: "30px" }} />

            <Box sx={{ display: "flex", gap: '2px' }}>
                <Button variant="outlined" sx={iconButtonStyle} onClick={() => navigate("/gallery")}>
                    <img src={gallery} alt="" style={{ width: "50px", objectFit: "cover" }} />
                </Button>
                {!collapsed && (
                    <Button sx={{ ...gradientBorderButton, height: "60px", mt: 1 }} style={{ width: '155px' }} onClick={() => navigate("/gallery")}>
                        Gallery
                    </Button>
                )}</Box>

            <Box sx={{ height: "40px" }} />

            <Box sx={{ display: "flex" }}>
                <Button variant="outlined" sx={iconButtonStyle} onClick={() => setCreateAlbum(true)}>
                    <img src={addAlbum} alt="Add Album" style={{ width: "50px", objectFit: "cover" }} />
                </Button>
                {!collapsed && (
                    <Button sx={{ ...gradientBorderButton, height: "60px", mt: 1 }}  style={{ width: '155px' }} onClick={() => setCreateAlbum(true)}>
                        Create Album
                    </Button>
                )}</Box>

            <Box sx={{ height: "40px" }} />

            <Box sx={{ display: "flex" }}>
                <Button variant="outlined" sx={iconButtonStyle} onClick={() => setUploadImage(true)}>
                    <img src={upload} alt="upload image" style={{ width: "50px", objectFit: "cover" }} />
                </Button>
                {!collapsed && (
                    <Button sx={{ ...gradientBorderButton, height: "60px", mt: 1 }}  style={{ width: '155px' }} onClick={() => setUploadImage(true)}>
                        Upload Image
                    </Button>
                )}</Box>

            <Box sx={{ height: "40px" }} />

            <Box sx={{ display: "flex" }}>
                <Button variant="outlined" sx={iconButtonStyle} onClick={() => navigate("/gallery/recycle-bin")}>
                    <img src={recycleBin} alt="recycle bin" style={{ width: "50px", objectFit: "cover" }} />
                </Button>
                {!collapsed && (
                    <Button sx={{ ...gradientBorderButton, height: "60px", mt: 1 }}  style={{ width: '155px' }} onClick={() => navigate("/gallery/recycle-bin")}>
                        Recycle Bin
                    </Button>
                )}</Box>

            {createAlbum && <CreateAlbum closeForm={setCreateAlbum} />}
            {uploadImage && <UploadImagePopup onClose={setUploadImage} />}
        </motion.div>
    );
};

export default GalleryNavBar;
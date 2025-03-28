import { Button } from "@mui/material";
import addAlbum from "../../../public/Icons/addAlbum.png"
import { gradientBorderButton, iconButtonStyle } from "../../styles/buttonsStyle";
import { useState } from "react";
import CreateAlbum from "../albums/CreateAlbum";
import UploadImagePopup from "../images/UploadImagePopup";
import upload from "../../../public/Icons/uploadIcon.png"
import recycleBin from "../../../public/Icons/recycleBin.png"
import { Outlet, useNavigate } from "react-router";

const GalleryNavBar = () => {
    const [createAlbum, setCreateAlbum] = useState(false);
    const [uploadImage, setUploadImage] = useState(false);
    const navigate = useNavigate();
    
    return (
        <>

            <Button variant="outlined" sx={iconButtonStyle} onClick={() => setCreateAlbum(true)}>
                <img src={addAlbum} alt="Add Album" style={{ width: '100%', marginTop: '35px' }} />
            </Button>

            <Button sx={{display: {xs: 'none',lg:'inline'} ,...gradientBorderButton}} onClick={() => setCreateAlbum(true)} style={{ height: '60px',marginTop:'20px' }}>
                create album
            </Button>

            <div style={{ width: '15vw', height: '25px' }}></div> {/*background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)*/}


            <Button variant="outlined" sx={iconButtonStyle} onClick={() =>setUploadImage(true)}>
                <img src={upload} alt="upload image" style={{ width: '100%', }} />
            </Button>
            <Button sx={{display: {xs: 'none',lg:'inline'} ,...gradientBorderButton}} onClick={() => setUploadImage(true)} style={{ height: '60px' }} className="textButton">
                Upload Image
            </Button>

            <div style={{ width: '15vw', height: '25px' }}></div> {/*background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)*/}
           
            <Button variant="outlined" sx={iconButtonStyle} onClick={() =>navigate('/gallery/recycle-bin')}>
                <img src={recycleBin} alt="Add Album" style={{ width: '100%', }} />
            </Button>

            <Button sx={{display: {xs: 'none',lg:'inline'} ,...gradientBorderButton}}  onClick={() =>navigate('/gallery/recycle-bin') } style={{ height: '60px' }}>
                Recycle Bin
            </Button>

            <div style={{ width: '15vw', height: '25px' }}></div> {/*background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)*/}
            {/* <Outlet />  */}
            {createAlbum && <CreateAlbum closeForm={setCreateAlbum} />}
            {uploadImage && <UploadImagePopup onClose={setUploadImage} />}
        </>
    );
};

export default GalleryNavBar;
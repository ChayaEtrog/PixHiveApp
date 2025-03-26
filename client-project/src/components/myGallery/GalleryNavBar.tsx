import { Button } from "@mui/material";
import addAlbum from "../../../public/Icons/addAlbum.png"
import imagesAndAlbums from "../../../public/Icons/imagesAndAlbums.png"
import { gradientBorderButton, iconButtonStyle } from "../../styles/buttonsStyle";
import { useState } from "react";
import CreateAlbum from "../albums/CreateAlbum";


const GalleryNavBar = () => {
    const [createAlbum, setCreateAlbum] = useState(false);
    return (
        <>
            <Button variant="outlined" sx={iconButtonStyle} onClick={() => setCreateAlbum(true)}>
                <img src={addAlbum} alt="Add Album" style={{ width: '100%', marginTop:'15px'}} />
            </Button>

            <Button sx={gradientBorderButton} onClick={() => setCreateAlbum(true)} style={{height:'60px'}}>
                create album
            </Button>

            <div style={{width: '15vw', height: '25px' }}></div> {/*background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)*/}

            <Button variant="outlined" sx={iconButtonStyle} onClick={() => setCreateAlbum(true)}>
                <img src={imagesAndAlbums} alt="Add Album" style={{ width: '100%', }} />
            </Button>
            
            <Button sx={gradientBorderButton} onClick={() => setCreateAlbum(true)} style={{height:'60px'}}>
            Recycle Bin
            </Button>

            <div style={{width: '15vw', height: '25px' }}></div> {/*background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)*/}

            {createAlbum && <CreateAlbum closeForm={setCreateAlbum} />}
        </>
    );
};

export default GalleryNavBar;
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../appStore";
import { UserContext } from "../user/UserReducer";
import { useContext, useEffect, useState } from "react";
import { fetchAlbumsByUser } from "../albums/albumSlice";
import { Box, Button, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Album } from "../../types/Album";
import { addFileToAlbum } from "../images/imageSlice";
import { gradientBorderButton, GradientButton } from "../../styles/buttonsStyle";

const MoveImageToAlbum = ({ fileId, closeForm }: { closeForm: Function, fileId: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        dispatch(fetchAlbumsByUser(user.id));
        
    }, [])

    const { allAlbums } = useSelector((store: StoreType) => store.album);
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

    const handleMove = async () => {
        if (selectedAlbumId) {
            await dispatch(addFileToAlbum({ albumId: selectedAlbumId, fileId }));
            closeForm();
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: "100vh",
                backgroundColor: "rgba(95, 94, 94, 0.48)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "350px",
                    maxHeight:"60vh"
                }}
            >
               {/* (
                    <CircularProgress /> // תוכל להוסיף spinner של טעינה
                ) : ( */}
                    <List>
                        {allAlbums.length === 0 ? (
                            <ListItem>No albums found</ListItem>
                        ) : (
                            allAlbums.map((album: Album) => (
                                <ListItem key={album.id} disablePadding>
                                    <ListItemButton
                                        selected={selectedAlbumId === album.id}
                                        onClick={() => setSelectedAlbumId(album.id)}
                                    >
                                        <ListItemText primary={album.albumName} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        )}
                    </List>
                {/* )} */}
    
                <Button onClick={handleMove}  sx={GradientButton} style={{height:40, marginRight:10,marginLeft:10, marginBottom:15,width:'45%'}}>copy</Button>
                <Button onClick={() => closeForm(false)} sx={gradientBorderButton} style={{height:40, marginBottom:15,width:'45%'}}>cancel</Button>
            </Box>
        </Box>
    );
}    

export default MoveImageToAlbum;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../appStore';
import { deleteFile, fetchDeletedFiles, recycleFile } from '../images/imageSlice';
import { Box, CircularProgress, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShowImage from '../images/ShowImage';
import imageIcon from "../../assets/Icons/imageIcon.png";
import delete1 from "../../assets/Icons/delete.png";
import recycle from "../../assets/Icons/recycle.png";
import recycleBin from "../../assets/Icons/recycleBin.png"
import { Image } from '../../types/Image';

const DeletedFilesGallery = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openImage, setOpenImage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ id: number, name: string, displayName: string }>({ id: 0, name: '', displayName: '', });
  const {
    image: { deletedFiles, pending },
  } = useSelector((store: StoreType) => ({ image: store.image }));

  useEffect(() => {
    dispatch(fetchDeletedFiles());
    console.log("Fetching deleted files...");
  }, [dispatch]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, file: Image) => {
    setSelectedFile({ id: file.id, displayName: file.displayName, name: file.name });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRecycle = () => {
    dispatch(recycleFile(selectedFile.id));
    setSelectedFile({ id: 0, name: '', displayName: '' });
  }

  const handleDelete = () => {
    dispatch(deleteFile(selectedFile.id));
    setSelectedFile({ id: 0, name: '', displayName: '' });
  }

  return (
    <div>
      <Box textAlign="center" mt={2}>
        <img src={recycleBin} alt="Recycle Bin" style={{ width: "50px", marginBottom: "2px" }} />
        <Typography variant="h4" color="text.secondary" mb={3}>
          Recycle Bin
        </Typography>
      </Box>
      {deletedFiles.length === 0 ? (
         <Typography variant="h6" mb={5} mt={3} textAlign="center" color="text.secondary">
         no deleted files.
       </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deletedFiles.map((file) => (
                  <TableRow key={file.id} hover sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (openImage !== file.name) { // בודק אם התמונה שכבר מוצגת היא אותה תמונה
                        setOpenImage(file.name);
                      }
                    }}
                  >
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        <img src={imageIcon} alt="image icon" style={{ marginRight: '15px', width: '24px' }} />
                        {file.displayName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(file.fileSize / 1024 < 1000)
                        ? `${(file.fileSize / 1024).toFixed(3)} KB`
                        : `${(file.fileSize / 1024 / 1024).toFixed(3)} MB`}
                    </TableCell>
                    <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton onClick={(event) => handleMenuClick(event, file)}>
                        <MoreVertIcon sx={{ padding: '4px' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => { handleClose(); handleRecycle(); }}><div style={{ display: 'flex' }}><img src={recycle} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Recycle</div> </MenuItem>
            <MenuItem onClick={() => { handleClose(); handleDelete(); }}><div style={{ display: 'flex' }}><img src={delete1} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Delete</div></MenuItem>
          </Menu>

          {openImage !== '' && <ShowImage fileName={openImage} closeImage={setOpenImage} />}
          {pending && (<><svg width={0} height={0}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e01cd5" />
                <stop offset="100%" stopColor="#1CB5E0" />
              </linearGradient>
            </defs>
          </svg>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40vh',
              }}
            >
              <CircularProgress
                sx={{ width: '100px !important', height: '100px !important', 'svg circle': { stroke: 'url(#my_gradient)' } }} />
            </Box></>)}
        </>
      )}
    </div>
  );
}
export default DeletedFilesGallery;
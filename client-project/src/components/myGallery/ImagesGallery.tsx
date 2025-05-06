import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import imageIcon from "../../../public/Icons/imageIcon.png";
import { useState } from 'react';
import ShowImage from './ShowImage';
import download from "../../../public/Icons/download.png";
import rename from "../../../public/Icons/rename.png";
import delete1 from "../../../public/Icons/delete.png";
import imagesAndAlbums from "../../../public/Icons/imagesAndAlbums.png";
import tag from "../../../public/Icons/tag.png"
import RenameImage from '../Image Operations/renameImage';
import { Image } from '../../types/Image';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { DownloadImage } from '../Image Operations/downloadAndPrintImage';
import MoveImageToAlbum from '../Image Operations/MoveImageToAlbum';
import { removeFileFromAlbum } from '../images/imageSlice';
import { useParams } from 'react-router';
import AddTag from '../Image Operations/AddTag';
import remove from "../../../public/Icons/x.png";
import RemoveTag from '../Image Operations/RemoveTag';
import AlertMessage from '../alertMessage';

const ImageGallery = ({ files }: { files: Image[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openImage, setOpenImage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<{ id: number, name: string, displayName: string }>({ id: 0, name: '', displayName: '', });
  const [isRename, setIsRename] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const { albumId } = useParams();
  const [addTag, setAddTag] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string|null>(null)
  const [removeTag, setRemoveTag] = useState(false);
  // const {
  //   image: { deleteStatusMessage, },
  // } = useSelector((store: StoreType) => ({ image: store.image }));

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, file: Image) => {
    setSelectedFile({ id: file.id, displayName: file.displayName, name: file.name });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const resultAction = await dispatch(removeFileFromAlbum({ fileId: selectedFile.id, albumId: albumId ? Number(albumId) : -1 }));
    handleClose(); 
  
    if (removeFileFromAlbum.fulfilled.match(resultAction)) {
      setDeleteMessage(resultAction.payload.message);
    }

    setSelectedFile({ id: 0, name: '', displayName: '' });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{boxShadow:'2px 2px 10px rgba(108, 108, 108, 0.13)'}}>
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
            {files.map((file) => (
              <TableRow key={file.id} hover sx={{ cursor: 'pointer' }} onClick={() => setOpenImage(file.name)}>
                <TableCell>
                  <div style={{ display: "flex" }}>
                    <img src={imageIcon} alt="image icon" style={{ marginRight: '15px', width: '24px' }} />
                    {file.displayName}
                  </div>
                </TableCell>
                {(file.fileSize / 1024 < 1000) && <TableCell>{(file.fileSize / 1024).toFixed(3)} KB</TableCell>}
                {(file.fileSize / 1024 >= 1000) && <TableCell>{(file.fileSize / 1024 / 1024).toFixed(3)} MB</TableCell>}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { setIsMoveOpen(true); handleClose(); }}><div style={{ display: 'flex' }} ><img src={imagesAndAlbums} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Organize in Album</div></MenuItem>
        <MenuItem onClick={() => { handleClose(); setAddTag(true) }}><div style={{ display: 'flex' }}><img src={tag} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Add tag</div></MenuItem>
        <MenuItem onClick={() => { handleClose(); setRemoveTag(true) }}><div style={{ display: 'flex' }}><img src={remove} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Remove tag</div></MenuItem>
        <MenuItem onClick={() => { setIsRename(true), handleClose() }}><div style={{ display: 'flex' }}><img src={rename} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Rename</div></MenuItem>
        <MenuItem onClick={() => { handleClose(), DownloadImage(selectedFile.name,dispatch) }}><div style={{ display: 'flex' }}><img src={download} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Download</div></MenuItem>
        <MenuItem onClick={() => { handleClose(), handleDelete() }}><div style={{ display: 'flex' }}><img src={delete1} alt="" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Delete</div></MenuItem>
      </Menu>

      {openImage !== '' && <ShowImage fileName={openImage} closeImage={setOpenImage} />}
      {isRename && <RenameImage oldName={selectedFile.displayName} fileId={selectedFile.id} closeForm={setIsRename} />}
      {isMoveOpen && <MoveImageToAlbum fileId={selectedFile.id} closeForm={setIsMoveOpen} />}
      {removeTag && <RemoveTag fileId={selectedFile.id} closeForm={setRemoveTag} />}
      {addTag && <AddTag fileId={selectedFile.id} closeForm={setAddTag} />}
      {deleteMessage&&<AlertMessage message={deleteMessage} />}

    </>
  );

  
};

export default ImageGallery;

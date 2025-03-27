import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Menu, IconButton } from '@mui/material';
import albumIcon from "../../../public/Icons/albumIcon.png"
import { useState } from 'react';
import { Album } from '../../types/Album';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import rename from "../../../public/Icons/rename.png";
import delete1 from "../../../public/Icons/delete.png";
import RenameAlbum from '../album operations/RenameAlbum';

interface FolderListProps {
  folders: any[];
  onFolderClick: (folder: any) => void;
}

const AlbumGallery = ({ folders, onFolderClick }: FolderListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFolder, setSelectedFolder] = useState<{name:string, albumId:number}>({name:'',albumId:-1});
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, album: Album) => {
    setSelectedFolder({name:album.albumName, albumId:album.id});
    console.log(selectedFolder.name);
    
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Folder Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folders.map((folder) => (
              <TableRow
                key={folder.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onFolderClick(folder)}
              >
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={albumIcon} alt="album icon" style={{ width: "24px", marginRight: "15px" }} />
                    {folder.albumName}
                  </div>
                </TableCell>
                <TableCell>{new Date(folder.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={(e) => handleMenuOpen(e, folder)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}><div style={{ display: 'flex' }} onClick={() => setIsRenameOpen(true)}><img src={rename} alt="rename" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Rename</div></MenuItem>
          <MenuItem onClick={handleMenuClose}><div style={{ display: 'flex' }}><img src={delete1} alt="delete" style={{ marginRight: '10px', width: '25px', objectFit: 'contain' }} />Delete</div></MenuItem>
        </Menu>
      </TableContainer>
      {isRenameOpen &&<RenameAlbum oldName={selectedFolder.name} closeForm={setIsRenameOpen} albumId={selectedFolder.albumId}/>}
    </>
  );
};
export default AlbumGallery;
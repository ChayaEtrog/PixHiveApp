import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import albumIcon from "../../../public/Icons/albumIcon.png"
interface FolderListProps {
  folders: any[];
  onFolderClick: (folder: any) => void;
}

const AlbumGallery = ({ folders, onFolderClick }: FolderListProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Folder Name</TableCell>
            <TableCell>Created</TableCell>
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
              <TableCell><div style={{display:"flex"}}><img src={albumIcon} alt="album icon" style={{width:"24px", marginRight:"15px"}}/>{folder.albumName}</div></TableCell>
              <TableCell>{new Date(folder.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default AlbumGallery;
import React from 'react';
import { Box } from '@mui/material';
import { Album } from '../../types/Album';
import { useNavigate } from 'react-router';

interface Props {
  pathStack: Album[];
  onNavigateToBreadcrumb: (index: number) => void;
}

const GalleryBreadcrumbs: React.FC<Props> = ({ pathStack, onNavigateToBreadcrumb }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 2 }}>
      <span
        style={{ cursor: 'pointer', color: 'blue' }}
        onClick={() => {
          navigate('/gallery');
          onNavigateToBreadcrumb(-1); // חזרה להתחלה
        }}
      >
        Gallery
      </span>
      {pathStack.map((album, index) => (
        <span key={album.id}>
          {' > '}
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => onNavigateToBreadcrumb(index)}
          >
            {album.albumName}
          </span>
        </span>
      ))}
    </Box>
  );
};

export default GalleryBreadcrumbs;

import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';
import { getDownloadUrl } from '../images/imageSlice';
import { AppDispatch, StoreType } from '../appStore';
import ErrorMessage from '../ErrorMessage';
import { CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ShowImage = ({ fileName, closeImage }: { fileName: string, closeImage: Function }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { downloadUrl, error, pending } = useSelector((store: StoreType) => store.image);
  const [isLoading, setIsLoading] = useState(true);

  // כאשר לוחצים על התמונה, מביאים את קישור ההורדה
  const handleImageLoad = () => {
    setIsLoading(false); // מתחילים להציג את התמונה
  };

  // מביאים את ה-URL להורדה של התמונה
  const fetchImageUrl = () => {
    dispatch(getDownloadUrl(fileName));
  };

  // טוענים את התמונה
  useEffect(() => {
    fetchImageUrl();
  }, [fileName]);

  return (
    <div className="fullscreen-container">
      {pending && isLoading&&<div style={{position:'absolute', top:50, left:48, zIndex:'1001' }}>
                              <svg width={0} height={0}>
                                  <defs>
                                      <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor="#e01cd5" />
                                          <stop offset="100%" stopColor="#1CB5E0" />
                                      </linearGradient>
                                  </defs>
                              </svg>
                              <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                          </div>}
      {downloadUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
          onClick={() => closeImage('')}
        >
          <img
            src={downloadUrl}
            alt="FullScreen"
            onLoad={handleImageLoad}
            style={{
              width: '65%',
              maxHeight: '80%',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <IconButton sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }} onClick={() => closeImage('')}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ShowImage;

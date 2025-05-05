import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDownloadUrl } from '../images/imageSlice';
import { AppDispatch, StoreType } from '../appStore';
import ErrorMessage from '../ErrorMessage';
import { CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DownloadImage, PrintImage } from '../Image Operations/downloadAndPrintImage';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

const ShowImage = ({ fileName, closeImage }: { fileName: string, closeImage: Function }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { downloadUrl, error } = useSelector((store: StoreType) => store.image);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const fetchImageUrl = () => {
    dispatch(getDownloadUrl(fileName));
  };

  useEffect(() => {
    fetchImageUrl();
  }, [fileName]);

  return (
    <div className="fullscreen-container">
      {isLoading && <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, 
        backgroundColor: 'rgba(0,0,0,0.3)'
      }}>
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
          display:'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
        }}
          onClick={() => closeImage('')}
        >
          <img
            src={downloadUrl}
            alt="FullScreen"
            onLoad={handleImageLoad}
            style={{
              display: !isLoading ? 'block' : 'none',
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

          <IconButton sx={{ position: 'absolute', top: 8, left: 56, }} onClick={(e) => { e.stopPropagation(); PrintImage(fileName, dispatch) }}>
            <PrintOutlinedIcon sx={{ color: 'white' }} />
          </IconButton>

          <IconButton sx={{ position: 'absolute', top: 8, left: 8, }} onClick={(e) => { e.stopPropagation(); DownloadImage(fileName, dispatch) }}>
            <FileDownloadOutlinedIcon sx={{ color: 'white' }} />
          </IconButton>

        </div>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ShowImage;

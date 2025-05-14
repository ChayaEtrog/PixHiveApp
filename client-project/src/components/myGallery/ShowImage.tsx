import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDownloadUrl } from '../images/imageSlice';
import { AppDispatch, StoreType } from '../appStore';
import ErrorMessage from '../ErrorMessage';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DownloadImage, PrintImage } from '../Image Operations/downloadAndPrintImage';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ImageEditor from '../Image Operations/ImageEditor';
import { motion } from "framer-motion";

const ShowImage = ({ fileName, closeImage }: { fileName: string, closeImage: Function }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { downloadUrl, error } = useSelector((store: StoreType) => store.image);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
    <>
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
          zIndex: 9998,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9997,
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

            <Tooltip title="print" PopperProps={{
              modifiers: [
                {
                  name: 'zIndex', enabled: true, phase: 'write',
                  fn: ({ state }) => { state.styles.popper.zIndex = '9999' },
                },
              ],
            }}>
              <IconButton sx={{ position: 'absolute', top: 8, left: 56, }} onClick={(e) => { e.stopPropagation(); PrintImage(fileName, dispatch) }}>
                <PrintOutlinedIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="download" PopperProps={{
              modifiers: [
                {
                  name: 'zIndex', enabled: true, phase: 'write',
                  fn: ({ state }) => { state.styles.popper.zIndex = '9999' },
                },
              ],
            }}>
              <IconButton sx={{ position: 'absolute', top: 8, left: 8, }} onClick={(e) => { e.stopPropagation(); DownloadImage(fileName, dispatch) }}>
                <FileDownloadOutlinedIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>

            <div style={{ position: "relative" }}>
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: 'fixed', top: 9, left: 130,
                  background: "linear-gradient(45deg, #47dcd1 , #dc8dec)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textShadow: "0 0 8px rgba(255,255,255,0.8)",
                  zIndex: 9998,
                  boxShadow: "0 0 10px #dc8dec",
                }}
              >
                new
              </motion.div>

              <Tooltip title="edit" PopperProps={{
                modifiers: [{
                  name: 'zIndex',
                  enabled: true,
                  phase: 'write',
                  fn: ({ state }) => { state.styles.popper.zIndex = '9999' },
                }],
              }}>
                <IconButton
                  sx={{ position: 'fixed', top: 8, left: 105 }}
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                >
                  <EditIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </div>

          </div>
        )}
        {error && <ErrorMessage message={error} />}
      </div>
      {isEditing && <ImageEditor image={downloadUrl} onClose={() => { setIsEditing(false); closeImage('') }} />}
    </>
  );
};

export default ShowImage;

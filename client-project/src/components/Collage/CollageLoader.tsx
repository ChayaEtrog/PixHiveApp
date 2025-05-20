import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../appStore';
import { getDownloadUrl, getFilesByUser } from '../images/imageSlice';
import { ImageSelector } from './ImageSelector';
import { UserContext } from '../user/UserReducer';
import { Box, CircularProgress } from '@mui/material';

type FileWithUrl = {
  name: string;
  displayName: string;
  url: string;
};

const CollageLoader = ({ initialSelection }: { initialSelection?: string[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const { user } = useContext(UserContext);
const [loading,setLoading]=useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const action = await dispatch(getFilesByUser(user.id));
        if (getFilesByUser.fulfilled.match(action)) {
          const files = action.payload as { name: string; displayName: string }[];
          const urls: FileWithUrl[] = [];

          for (const file of files) {
            const urlAction = await dispatch(getDownloadUrl(file.name));
            if (getDownloadUrl.fulfilled.match(urlAction)) {
              urls.push({ ...file, url: urlAction.payload });
            }
          }

          setFiles(urls);
          setLoading(false)
        }
      } catch {

      }
    };

    loadAll();
    console.log(files);
  }, [dispatch]);

  return (
    <>
      {loading&&<><svg width={0} height={0}>
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
          height: '76vh',
        }}
      >
        <CircularProgress
          sx={{ width: '100px !important', height: '100px !important', 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </Box></>}

    {!loading&& <ImageSelector images={files} initialSelection={initialSelection ?? []}/>}
    </>);
};

export default CollageLoader;

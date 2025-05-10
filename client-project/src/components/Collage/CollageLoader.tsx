import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { AppDispatch } from '../appStore';
import { getDownloadUrl, getFilesByUser } from '../images/imageSlice';
import { ImageSelector } from './ImageSelector';
import { UserContext } from '../user/UserReducer';

type FileWithUrl = {
  name: string;
  displayName: string;
  url: string;
};

const CollageLoader = ({ initialSelection }: { initialSelection?: string[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

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
        }
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    console.log(files);
    
  }, [dispatch]);

  if (loading) return <CircularProgress />;

  return <ImageSelector images={files} initialSelection={initialSelection ?? []} />;
};

export default CollageLoader;

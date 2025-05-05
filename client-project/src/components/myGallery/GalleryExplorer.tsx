import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Album } from '../../types/Album';
import { AppDispatch, StoreType } from '../appStore';
import { fetchChildAlbums } from '../albums/albumSlice';
import { UserContext } from '../user/UserReducer';
import ErrorMessage from '../ErrorMessage';
import { Box, CircularProgress, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { clearSearch, getFilesByAlbum, getRootFilesByUser, resetFiles } from '../images/imageSlice';
import AlbumsGallery from './AlbumsGallery';
import ImageGallery from './ImagesGallery';
import { useLocation, useNavigate, useParams } from 'react-router';
import GalleryBreadcrumbs from './Breadcrumbs';
import GalleryNavBar from './GalleryNavBar';
import DeletedFilesGallery from './DeletedFilesGallery';
import Search from './Search';
import { buildBreadcrumbsPath, fetchAlbumById } from '../albums/albumService';
import clear from '../../../public/Icons/clear.png'
const GalleryExplorer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    image: { files: images, error: imageError, uploading, isSearch },
    album: { albums, error: albumError, loading: albumLoading },
  } = useSelector((store: StoreType) => ({
    image: store.image,
    album: store.album,
  }));
  const location = useLocation();
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [pathStack, setPathStack] = useState<Album[]>([]);
  const { user } = useContext(UserContext);
  const [isClearSearch, setIsClearSearch] = useState(false);
  const [album, setAlbum] = useState<Album | null>(null);

  const reloadCurrentAlbum = () => {
    if (albumId) {
      dispatch(fetchChildAlbums({ userId: user.id, parentId: Number(albumId) }));
      dispatch(resetFiles());
      dispatch(getFilesByAlbum(Number(albumId)));
    } else {
      setPathStack([]);
      dispatch(fetchChildAlbums({ userId: user.id, parentId: -1 }));
      dispatch(resetFiles());
      dispatch(getRootFilesByUser(user.id));
    }
  };

  useEffect(() => {
    // בכל שינוי של הכתובת - נבדוק אם חזרנו מדף סל המחזור
    if (location.pathname !== '/gallery/recycle-bin') {
      reloadCurrentAlbum();
    }
  }, [location.pathname]);

  useEffect(() => {
    reloadCurrentAlbum();
  }, [albumId, user.id, dispatch]);

  const handleFolderClick = (album: Album) => {
    setPathStack(prev => [...prev, album]);
    navigate(`/gallery/album/${album.id}`); 
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setPathStack([]);
      navigate('/gallery');
      return;
    }
    const targetAlbum = pathStack[index];
    const newStack = pathStack.slice(0, index + 1);
    setPathStack(newStack);
    navigate(`/gallery/album/${targetAlbum.id}`); 
  };

  useEffect(() => {
    console.log("album");

    const getAlbum = async () => {
      const result = await fetchAlbumById(Number(albumId));
      setAlbum(result);
    };
    getAlbum();
  }, [albumId]);

  useEffect(() => {
    const handleClearSearch = async () => {
      dispatch(clearSearch());
      await reloadCurrentAlbum();
      if (albumId) {
        try {
          const path = await buildBreadcrumbsPath(album);
          setPathStack(path);
        } catch (err) {
          console.error("Failed to build breadcrumbs path", err);
        }
      }

      setIsClearSearch(false);
    };

    if (isClearSearch) {
      handleClearSearch();
    }
  }, [isClearSearch, albumId, dispatch]);


  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', marginTop: '80px', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '15vw', }}>
        <GalleryNavBar />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${250}px)` },
          mt: { xs: 7, sm: 0 },
          overflowY: 'auto',
          bgcolor: 'rgba(244, 244, 244, 0.41)'
          , marginBottom: '60px'
        }}
      >
        {albumError && <ErrorMessage message={albumError} />}
        {imageError && <ErrorMessage message={imageError} />}

        {albumLoading || uploading ? (
          <>
            <svg width={0} height={0}>
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
            </Box>
          </>
        ) : (
          <>
            {location.pathname !== "/gallery/recycle-bin" && <>
              <Search userId={user.id} />
              {isSearch ? (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#555', fontStyle: 'italic', fontSize: '16px' }}>
                    Search results in - {album ? album.albumName : 'root directory'}
                  </Typography>
                  <Tooltip title="Clear search">
                    <IconButton onClick={() => setIsClearSearch(true)} size="small" sx={{ color: '#888' }}>
                      <img src={clear} alt="" style={{ width: '24px' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ) : (
                albumId && <GalleryBreadcrumbs pathStack={pathStack} onNavigateToBreadcrumb={navigateToBreadcrumb} />
              )}
              {(images.length == 0 && albums.length == 0) && <h3>no files or albums found to this album</h3>}

              {albums.length > 0 && <AlbumsGallery folders={albums} onFolderClick={handleFolderClick} />}
              <div style={{ height: '5vh', width: '9px' }}></div>

              {images.length > 0 && <ImageGallery files={images} />

              }
            </>}
            {location.pathname === "/gallery/recycle-bin" && <DeletedFilesGallery />}

          </>
        )}
      </Box>
    </Box >
  );
}


export default GalleryExplorer;
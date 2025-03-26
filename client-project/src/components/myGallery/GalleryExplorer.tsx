import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Album } from '../../types/Album';
import { AppDispatch, StoreType } from '../appStore';
import { fetchChildAlbums, getFilesByAlbum, resetFiles } from '../albums/albumSlice';
import { UserContext } from '../user/UserReducer';
import ErrorMessage from '../ErrorMessage';
import { Box, CircularProgress } from '@mui/material';
import { getRootFilesByUser, resetRootFiles } from '../images/imageSlice';
import AlbumsGallery from './AlbumsGallery';
import ImageGallery from './ImagesGallery';
import { useNavigate, useParams } from 'react-router';
import GalleryBreadcrumbs from './Breadcrumbs';
import GalleryNavBar from './GalleryNavBar';

const GalleryExplorer=()  => {
    const dispatch = useDispatch<AppDispatch>();
    const { 
        image: { files: rootFiles, error: imageError, uploading },
        album: { albums, error: albumError, loading: albumLoading, files: albumfiles },
    } = useSelector((store: StoreType) => ({
        image: store.image,
        album: store.album,
    }));
    
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [pathStack, setPathStack] = useState<Album[]>([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (albumId) {
            dispatch(fetchChildAlbums({ userId: user.id, parentId: Number(albumId) }));
            dispatch(getFilesByAlbum(Number(albumId)));
            dispatch(resetRootFiles());
        } else {
            setPathStack([]);
            dispatch(fetchChildAlbums({ userId: user.id, parentId: -1 }));
            dispatch(getRootFilesByUser(user.id));
            dispatch(resetFiles());
        }
    }, [albumId, user.id, dispatch]);

    const handleFolderClick = (album: Album) => {
        setPathStack(prev => [...prev, album]);
        navigate(`/album/${album.id}`);
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
        navigate(`/album/${targetAlbum.id}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', marginTop: '80px', height: '100vh', overflow:'hidden'}}>
            <Box sx={{ width: '15vw', }}>
                <GalleryNavBar />
            </Box>

            {/* תוכן ראשי */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    width: { sm: `calc(100% - ${250}px)` },
                    mt: { xs: 7, sm: 0 }, 
                    overflowY:'auto',
                    bgcolor: 'rgba(244, 244, 244, 0.41)'
                    ,marginBottom:'60px' 
                }}
            >
                {albumId && <GalleryBreadcrumbs pathStack={pathStack} onNavigateToBreadcrumb={navigateToBreadcrumb} />}

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
                        {(rootFiles.length == 0 && albumfiles.length == 0 && albums.length == 0) && <h3>no files or albums found to this album</h3>}

                        {albums.length > 0 && <AlbumsGallery folders={albums} onFolderClick={handleFolderClick} />}
                        <div style={{ height: '5vh', width: '9px' }}></div>

                        {rootFiles.length > 0 && <ImageGallery files={rootFiles} />}
                        {albumfiles.length > 0 && <ImageGallery files={albumfiles} />}
                    </>
                )}
            </Box>
        </Box >
  );
}


export default GalleryExplorer;
import { createHashRouter } from "react-router"
import AppLayout from "./components/AppLayout"
import ErrorPage from "./components/ErrorPage"
import UploadImage from "./components/images/upload/UploadImage"
import GalleryExplorer from "./components/gallery/GalleryExplorer"
import DeletedFilesGallery from "./components/gallery/DeletedFilesGallery"
import GalleryNavBar from "./components/gallery/GalleryNavBar"
import MessageBox from "./components/messages/MessageBox"
import Dashboard from "./components/dashboard/Dashboard"
import ImageEditor from "./components/images/actions/ImageEditor"
import HomeContainer from "./components/home/HomeContainer"
import CollageLoader from "./components/collage/CollageLoader"


export const router =  createHashRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomeContainer/> },
            { path: 'home', element: <HomeContainer/>  },
            {path:'nav-bar', element: <GalleryNavBar/>},
            { path: 'upload-image', element: <UploadImage /> },
            { path: 'gallery', element: <GalleryExplorer /> },
            {
                path: "gallery",
                element: <GalleryExplorer />, 
                children: [
                    { path: "album/:albumId", element: <GalleryExplorer /> },
                    { path: "recycle-bin", element: <DeletedFilesGallery /> },
                ],
            },
            { path: 'messages', element: <MessageBox /> },
            { path: 'dashboard', element: <Dashboard/> },
            { path: 'collage', element: <CollageLoader/> },
            { path:"edit", element: <ImageEditor />}
            
        ]
    }
])
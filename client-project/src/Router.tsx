import { createBrowserRouter } from "react-router"
import Home from "./components/Home"
import AppLayout from "./components/AppLayout"
import ErrorPage from "./components/ErrorPage"
import UploadImage from "./components/images/UploadImage"
import GalleryExplorer from "./components/myGallery/GalleryExplorer"
import DeletedFilesGallery from "./components/myGallery/DeletedFilesGallery"
import GalleryNavBar from "./components/myGallery/GalleryNavBar"
import MessageBox from "./components/messages/MessageBox"
import Dashboard from "./Dashboard/Dashboard"
import { ImageSelector } from "./components/Collage/ImageSelector"
import CollageLoader from "./components/Collage/CollageLoader"


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> },
            {path:'nav-bar', element: <GalleryNavBar/>},
            { path: 'upload-image', element: <UploadImage /> },
            { path: 'gallery', element: <GalleryExplorer /> },
            {
                path: "gallery",
                element: <GalleryExplorer />, // קומפוננטת האב
                children: [
                    { path: "album/:albumId", element: <GalleryExplorer /> },
                    { path: "recycle-bin", element: <DeletedFilesGallery /> },
                ],
            },
            { path: 'messages', element: <MessageBox /> },
            { path: 'dashboard', element: <Dashboard/> },
            { path: 'collage', element: <CollageLoader/> }
            
        ]
    }
])
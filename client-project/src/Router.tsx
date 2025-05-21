import { createBrowserRouter } from "react-router"
import AppLayout from "./components/AppLayout"
import ErrorPage from "./components/ErrorPage"
import UploadImage from "./components/images/UploadImage"
import GalleryExplorer from "./components/myGallery/GalleryExplorer"
import DeletedFilesGallery from "./components/myGallery/DeletedFilesGallery"
import GalleryNavBar from "./components/myGallery/GalleryNavBar"
import MessageBox from "./components/messages/MessageBox"
import Dashboard from "./dashboard/Dashboard"
import CollageLoader from "./components/collage/CollageLoader"
import ImageEditor from "./components/image Operations/ImageEditor"
import HomeContainer from "./components/homePages/HomeContainer"


export const router = createBrowserRouter([
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
                element: <GalleryExplorer />, // קומפוננטת האב
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
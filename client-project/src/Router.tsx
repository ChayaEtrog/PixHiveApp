import { createBrowserRouter } from "react-router"
import Home from "./components/Home"
import AppLayout from "./components/AppLayout"
import ErrorPage from "./components/ErrorPage"
import UploadImage from "./components/images/UploadImage"
import GalleryExplorer from "./components/myGallery/GalleryExplorer"


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> },
            { path: 'upload-image', element: <UploadImage /> },
            { path: 'gallery', element: <GalleryExplorer /> },
            { path:'album/:albumId', element: <GalleryExplorer /> },
        ]
    }
])
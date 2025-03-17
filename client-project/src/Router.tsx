import {createBrowserRouter } from "react-router"
import Home from "./components/Home"
import AppLayout from "./components/AppLayout"
import ErrorPage from "./components/ErrorPage"


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <ErrorPage/>,
        children: [
            { index: true, element: <Home /> },
            { path: 'home', element: <Home /> }
        ]
    }
])
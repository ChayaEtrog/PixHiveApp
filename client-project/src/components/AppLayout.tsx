import { Outlet } from "react-router";
import NavBar from "./NavBar";


function AppLayout() {
    return (<>
        <NavBar />
        <Outlet />
    </>)
}

export default AppLayout;
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { useContext } from "react";
import { UserContext } from "./user/UserReducer";
import Home from "./Home";


function AppLayout() {
    const { user } = useContext(UserContext);
    return (
        <>
        {
            (user.email != '') && <>
                <NavBar />
                <Outlet /></>
                
        }
        {
            (user.email=== '')&&<Home/>
        }
        </>
    )
}

export default AppLayout;
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import { useContext } from "react";
import { UserContext } from "./user/UserReducer";
import Home from "./Home";
import HomePage from "./HomePages/HomePage";
import Manager from "./HomePages/Manager";


function AppLayout() {
    const { user } = useContext(UserContext);
    return (
        <>
        {
            (user.email != '') && <>
                {/* <NavBar />
                <Outlet /> */}
                <Manager/>
                </>
                
        }
        {
            (user.email=== '')&&<Home/>
        }
        </>
    )
}

export default AppLayout;
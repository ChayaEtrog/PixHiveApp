import { Outlet, useLocation } from "react-router";
import NavBar from "./NavBar";


const AppLayout=()=> {
    const location = useLocation();
  
    // רשימת עמודים שבהם לא מציגים NavBar
    const hideNavbarRoutes = ["/", "/home"];
  
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());
  
    return (
      <>
        {!shouldHideNavbar && <NavBar />}
        <Outlet />
      </>
    );
  }
  
  export default AppLayout;
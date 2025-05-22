import { Navigate, Outlet, useLocation } from "react-router";
import NavBar from "./NavBar";

const AppLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/home"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());

  const isProtected = location.pathname !== "/" && location.pathname !== "/home";

  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  if (!user && isProtected ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Outlet />
    </>
  );
}

export default AppLayout;
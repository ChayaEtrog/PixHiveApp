import { useContext } from "react";
import { UserContext } from "../user/UserReducer";
import AuthHomePage from "./AuthHomePage";
import HomePage from "./HomePage";

function GetStartedManager() {
    const { user } = useContext(UserContext);
    return (
        <>
            {(user.email == '') ?
                (<AuthHomePage />)
                : (<HomePage />)
            }
        </>)
}

export default GetStartedManager;
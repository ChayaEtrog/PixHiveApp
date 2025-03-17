import { Box } from "@mui/material";
import homePic from "../../public/pictures/homePic.png"
function Home(){

    return (
        <>
         <Box sx={{ width: '100%', height: '700px', backgroundImage: `url(${homePic})`}}>
         </Box>
        <h1>Welcome to PicHive</h1>
        </>)
}

export default Home;
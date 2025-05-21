import { Box } from "@mui/material";
import pixHive from "../../../public/pictures/PixHive.png"
import { motion } from "framer-motion";
import AuthModalManager from "../user/AuthModelManager";
import { useEffect } from "react";

const AuthHomePage = () => {

    useEffect(() => {
        console.log("log in");
    }, [])

    return (

        <Box
            sx={{
                position: "relative",
                backgroundImage: `url(${pixHive})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {[...Array(40)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 8, 0, 8],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    style={{
                        position: "absolute",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 0 6px 3px rgba(255,255,255,0.4)",
                    }}
                />
            ))}

            <AuthModalManager />
        </Box>
    );
};

export default AuthHomePage;
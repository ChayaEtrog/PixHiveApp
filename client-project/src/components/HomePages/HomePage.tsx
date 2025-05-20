import { Box } from "@mui/material";
import pixHiveLogedin from "../../../public/pictures/PixHiveLogedCut.png"
import { motion } from "framer-motion";

const HomePage = () => {
    return (
      
        <Box
            sx={{
                position: "relative",
                backgroundImage: `url(${pixHiveLogedin})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* נקודות אור מרחפות */}
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

<motion.button
    animate={{
      x:[-30,30]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: [0.42, 0, 0.58, 1],
    }}
    style={{
      position: "absolute",
      bottom: "30px",
      left: "46%",
      transform: "translateX(-50%)",
      padding: "12px 28px",
      fontSize: "1.2rem",
      borderRadius: "30px",
      border: "2px solid white",
      backgroundColor: "transparent",
      color: "white",
      cursor: "pointer",
      backdropFilter: "blur(3px)",
    }}
    whileHover={{
      scale: 1.1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    }}
    whileTap={{ scale: 0.95 }}
  >
    Get Started
  </motion.button>
        </Box>
    );
};

export default HomePage;
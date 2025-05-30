import pixHiveLogedin from "../../assets/pictures/PixHiveLogedCut.png"
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Box, Link } from "@mui/material"; 
import { Link as RouterLink } from 'react-router';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/gallery");
  };

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
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 24,
          display: "flex",
          gap: 3,
        }}
      >
        <Link component={RouterLink} to="/collage" color="white" underline="hover">
        Collage
        </Link>
        <Link component={RouterLink} to="/gallery" color="white" underline="hover">
          Gallery
        </Link>
        <Link component={RouterLink} to="/upload-image" color="white" underline="hover">
          Upload Image
        </Link>
        <Link component={RouterLink} to="/messages" color="white" underline="hover">
          Messages
        </Link>
        <Link component={RouterLink} to="/dashboard" color="white" underline="hover">
          Dashboard
        </Link>
      </Box>

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
            boxShadow: "0 0 6px 3px rgba(255,255,255,0.4)"
          }}
        />
      ))}

      <motion.button
        animate={{ x: [-30, 30] }}
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
        onClick={handleNavigate}
      >
        Get Started
      </motion.button>
    </Box>
  );
};

export default HomePage;

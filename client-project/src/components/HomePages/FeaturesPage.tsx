import { Box, Button, Container, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { gradientBorderButton } from "../../styles/buttonsStyle";
import { useNavigate } from "react-router";

const ImageCarousel = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);
    const handlePrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const handleNext = () => setIndex((prev) => (prev + 1) % images.length);

    return (
        <Box
            sx={{
                flex: 1,
                padding: "2px",
                borderRadius: 2.5,
                background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
                display: "inline-block",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: 300,
                    borderRadius: 2,
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={images[index]}
                    alt="preview"
                    style={{ maxHeight: "99.5%", objectFit: "contain", width: '100%' }}
                />

                <IconButton
                    onClick={handlePrev}
                    sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                    <ArrowBackIos />
                </IconButton>

                <IconButton
                    onClick={handleNext}
                    sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
                >
                    <ArrowForwardIos />
                </IconButton>
            </Box>
        </Box>
    );
};

const animatedGradientStyle = {
    fontWeight: "bold",
    background: "linear-gradient(-45deg, #47dcd1, #dc8dec, #47dcd1, #dc8dec)",
    backgroundSize: "400% 400%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "gradientShift 8s ease infinite",
};

export default function FeaturesPage() {
    const exampleImages = [
        "../../../public/HomePagePictures/26e76ab82d8372e069827ec68299ca34.jpg",
        "../../../public/HomePagePictures/9066555d20cff721dfff5a43b9b8e3fb.jpg",
        "../../../public/HomePagePictures/b92183db6b2707cd94a72b7afdc6342d.jpg",
        "../../../public/HomePagePictures/be494e569d56436ad6aa7d0ec522a07d.jpg",
        "../../../public/HomePagePictures/ea43e88b6abccb38da2469a99d482dd4.jpg",
        "../../../public/HomePagePictures/d7289b35fb4b55f433f32d76533b898a.jpg",
    ];
    const navigate = useNavigate();

    const handleCollageNavigate = () => {
        navigate("/collage");
    };

    const handleEditNavigate = () => {
        navigate("/gallery");
    };

    return (
        <>
            <style>
                {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>

            <Box sx={{ py: 8, backgroundColor: "#fafafa", height: '88vh' }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.4 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: "center",
                                mb: 10,
                            }}
                        >
                            <Box sx={{ flex: 1, p: 2 }}>
                                <Typography variant="h4" gutterBottom sx={animatedGradientStyle}>
                                    AI Image Enhancement
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    Use artificial intelligence to enhance, colorize or transform your images in creative ways.
                                </Typography>
                                <Button sx={gradientBorderButton} style={{ width: 'max-content', backgroundColor: 'rgba(0,0,0,0)' }} onClick={handleEditNavigate}>
                                    Try AI Editing
                                </Button>
                            </Box>

                            <ImageCarousel images={exampleImages} />
                        </Box>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.4 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column-reverse", md: "row" },
                                alignItems: "center",
                            }}
                        >
                            <ImageCarousel images={exampleImages} />

                            <Box sx={{ flex: 1, p: 4 }}>
                                <Typography variant="h4" gutterBottom sx={animatedGradientStyle}>
                                    Create Stunning Collages
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    Combine your favorite images into beautiful and dynamic collages in seconds.
                                </Typography>
                                <Button sx={gradientBorderButton} style={{ width: 'max-content', backgroundColor: 'rgba(0,0,0,0)' }} onClick={handleCollageNavigate}>
                                    Make a Collage
                                </Button>
                            </Box>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </>
    );
}

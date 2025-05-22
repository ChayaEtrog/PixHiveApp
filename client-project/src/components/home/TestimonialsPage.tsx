import { useRef, useEffect } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    useTheme,
} from '@mui/material';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import backgroundPic from '../../assets//HomePagePictures/emptyBackground.png'

const testimonials = [
    {
        name: 'Ella Cohen',
        title: 'Product Designer @ Canva',
        quote:
            'This platform transformed the way I organize my digital content. It’s clean, smart, and fast!',
    },
    {
        name: 'Olivia Martinez',
        title: 'Professional Photographer',
        quote:
            'The perfect platform to organize my clients’ photos. Easy to upload, beautiful albums, and secure storage.',
    },
    {
        name: 'James Silver',
        title: 'Amateur Photographer',
        image: 'https://i.pravatar.cc/150?img=45',
        quote:
            'I finally found a tool that keeps my photos organized and easy to find, even after months of shooting.',
    },
    {
        name: 'Emily Parker',
        title: 'Amateur Photographer',
        image: 'https://i.pravatar.cc/150?img=45',
        quote:
            'The AI editing features are impressive and simple to use. Collage creation adds a fun way to display my shots.',
    },
    {
        name: 'Ethan Brooks',
        title: 'Wedding Photographer',
        image: 'https://i.pravatar.cc/150?img=41',
        quote:
            'The AI editing features deliver professional results fast. Clients love the custom collages I create for them.',
    },
    {
        name: 'Sophie Turner',
        title: 'Mom & Blogger',
        image: 'https://i.pravatar.cc/150?img=8',
        quote:
            'This platform makes photo editing and collage-making a breeze. Perfect for preserving and sharing family memories.',
    },
];

export default function TestimonialsPage() {
    const theme = useTheme();
    const scrollRef = useRef(null);

    // scroll-linked animation bar
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"],
    });

    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // headline animation
    const headingControls = useAnimation();
    const headingRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    headingControls.start({ y: 0, opacity: 1 });
                } else {
                    headingControls.start({ y: -60, opacity: 0 });
                }
            },
            { threshold: 0.4 }
        );

        if (headingRef.current) {
            observer.observe(headingRef.current);
        }

        return () => {
            if (headingRef.current) {
                observer.unobserve(headingRef.current);
            }
        };
    }, [headingControls]);

    return (
        <div
            ref={scrollRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            {/* שכבת רקע מטושטשת */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${backgroundPic})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(10px)',
                    transform: 'scale(1.05)',
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    color: '#fff',
                }}
            >
                <motion.div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '5px',
                        background: theme.palette.secondary.main,
                        width: '100%',
                        transformOrigin: '0%',
                        scaleX,
                        zIndex: 10,
                    }}
                />

                <Container sx={{ pt: 12, maxWidth: '100vw' }}>
                    <motion.div
                        ref={headingRef}
                        initial={{ y: -60, opacity: 0 }}
                        animate={headingControls}
                        transition={{ type: 'spring', stiffness: 80 }}
                    >
                        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                            What Our Users Say
                        </Typography>
                        <Typography variant="subtitle1" align="center" color="gray">
                            Real feedback from our happy users
                        </Typography>
                    </motion.div>

                    <motion.div
                        className="hide-scrollbar"
                        style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 16,
                            paddingTop: 32,
                            paddingBottom: 32,
                            scrollbarWidth: 'thin',
                            scrollbarColor: `rgba(255, 255, 255, 0.73) transparent`,
                            scrollSnapType: 'x mandatory',
                            overflowY: 'hidden',
                        }}
                    >
                        {testimonials.map((t, idx) => (
                            <motion.div
                                key={idx}
                                style={{
                                    flexShrink: 0,
                                    width: 'calc((100% / 4) - 16px)',
                                    scrollSnapAlign: 'start',
                                }}
                                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                <Card
                                    elevation={10}
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: 4,
                                        padding: 2,
                                        height: '100%',
                                        transition: '0.3s',
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                            <Avatar src="/broken-image.jpg" sx={{ width: 56, height: 56, mb: 2, display: 'flex', backgroundColor:'rgba(0, 0, 0, 0.16)' }} />
                                        </Box>
                                        <Typography variant="body1" gutterBottom>
                                            "{t.quote}"
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {t.name}
                                        </Typography>
                                        <Typography variant="caption" color="gray">
                                            {t.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>

                {/* Floating scroll animation text */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '-20%',
                        fontSize: '6rem',
                        fontWeight: 700,
                        opacity: 0.1,
                        whiteSpace: 'nowrap',
                    }}
                    animate={{ x: ['-20%', '120%'] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: 'linear',
                    }}
                >
                    Loved by thousands of users worldwide
                </motion.div>

                <style>{`
                       .hide-scrollbar::-webkit-scrollbar {
                        height: 8px;
                        }
                      .hide-scrollbar::-webkit-scrollbar-track {
                       background: transparent;
                       }
                       .hide-scrollbar::-webkit-scrollbar-thumb {
                       background-color: rgb(255,255,255) !important;
                       border-radius: 10px;
                      }
                `}</style>
            </div>
        </div>
    );
}

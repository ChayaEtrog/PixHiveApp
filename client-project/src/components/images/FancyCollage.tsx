import Draggable from 'react-draggable';
import { useState, useRef, RefObject } from 'react';
import {
    Box,
    TextField,
    Typography,
    ImageList,
    ImageListItem,
    IconButton,
    CircularProgress,
} from '@mui/material';
import html2canvas from 'html2canvas';
import DownloadImage from '../../../public/Icons/download.png';
import ImageIcon from '../../../public/Icons/imageIcon.png';

type CollageProps = {
    images: string[];
    variant: 'masonry' | 'quilted';
    title: string;
};

const CollageBlock = ({ images, variant, title }: CollageProps) => {
    const ref = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [text, setText] = useState('');
    const [color, setColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(20);
    const [fontWeight, setFontWeight] = useState(500)

    const handleDownload = async () => {
        if (!ref.current) return;

        const canvas = await html2canvas(ref.current, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        link.download = `${title}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const nodeRef = useRef(null!) as RefObject<HTMLElement>;

    const imageStyles: React.CSSProperties = {
        objectFit: 'cover',
    };

    return (
        <Box sx={{ mb: 6 }} >
            <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <TextField label="text" value={text} onChange={(e) => setText(e.target.value)} />
                <TextField
                    label="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    sx={{ width: 80 }}
                />
                <TextField
                    label="font size"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    sx={{ width: 120 }}
                />
                <TextField
                    label="bold"
                    type="number"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(parseInt(e.target.value))}
                    sx={{ width: 120 }}
                />
            </Box>

            <Box
                sx={{
                    width: '60%',
                    mx: 'auto',
                    position: 'relative',
                    display: 'inline-block',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 2
                }}
                ref={ref}
            >
                <ImageList
                    variant={variant}
                    cols={
                        images.length === 1 ? 1 :
                            images.length === 2 ? 2 :
                                3
                    }
                    gap={8}

                    sx={{
                        width: images.length <= 2 ? 'fit-content' : '100%',
                        maxWidth: '100%',
                        margin: '0 auto',
                        overflow: 'hidden',
                    }}
                >
                    {!isLoaded &&<><svg width={0} height={0}>
                              <defs>
                                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#e01cd5" />
                                  <stop offset="100%" stopColor="#1CB5E0" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} /></>}
                    {images.map((src, index) => (
                        <ImageListItem key={index}>
                            <img
                                src={src}
                                alt={`Collage image ${index + 1}`}
                                loading="lazy"
                                crossOrigin="anonymous"
                                style={imageStyles}
                                onLoad={() => setIsLoaded(true)}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>

                {text && (
                    <Draggable nodeRef={nodeRef}>
                        <Typography
                            sx={{
                                position: 'absolute',
                                color,
                                fontSize,
                                fontWeight,
                                userSelect: 'none',
                                cursor: 'move',
                                pointerEvents: 'auto',
                                zIndex: 10,
                            }}
                            ref={nodeRef}
                        >
                            {text}
                        </Typography>
                    </Draggable>
                )}

            </Box>
            <Box sx={{textAlign:'start'}}>
                <IconButton onClick={handleDownload} sx={{ mt: 2 }} >
                    <img src={DownloadImage} alt="download icon" style={{ width: '40px' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default function FancyCollage({ images }: { images: string[] }) {
    return (
        <Box sx={{ p: 2 }}>
            <CollageBlock images={images} variant="masonry" title=" Modern Collage" />
            <CollageBlock images={images} variant="quilted" title=" Quilted Collage" />
        </Box>
    );
}


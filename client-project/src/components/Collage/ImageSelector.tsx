import ShowImage from '../myGallery/ShowImage';
import arrow from '../../../public/Icons/arrow.png'
import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { gradientBorderButton, GradientButton } from '../../styles/buttonsStyle';

import FancyCollage from './FancyCollage';
import { useState } from 'react';
import { LazyImage } from '../images/LazyImage';


type Props = {
    images: { name: string; displayName: string; url: string }[];
    initialSelection: string[];
};

export const ImageSelector = ({ images, initialSelection }: Props) => {
    const [selected, setSelected] = useState<string[]>(initialSelection);
    const [createCollage, setCreatCollage] = useState(false);
    const [showImage, setShowImage] = useState<string | null>(null);
    const [collageSelection, setCollageSelection] = useState<string[]>([]);

    const isSelected = (fileName: string) => selected.includes(fileName);

    const toggleSelect = (fileName: string) => {
        setSelected(prev =>
            isSelected(fileName)
                ? prev.filter(name => name !== fileName)
                : [...prev, fileName]
        );
    };


    return (

        <Box p={2} sx={{ height: '85vh', overflowY: 'auto', marginTop: '75px' }}>

            {!createCollage && (
                <>
                    {images.length > 0 ? (
                        <Typography variant="h6" mb={5} mt={3} textAlign="center">
                            Select pictures for your collage
                        </Typography>
                    ) : (
                        <Typography variant="body1" mb={5} mt={3} textAlign="center" color="text.secondary">
                            No images available. Please upload some pictures to get started.
                        </Typography>
                    )}
                    <Box>
                        <Grid container spacing={4} pb={5}>
                            {images.map((img) => (
                                <Grid item xs={6} sm={3} key={img.name} >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            position: 'relative',
                                            padding: 1,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            border: '0.004px solid rgba(172, 172, 172, 0.43)',
                                            boxShadow: '2px 1px 10px rgba(108, 108, 108, 0.13)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(img.url);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                width: 24,
                                                height: 24,
                                                border: '1px solid',
                                                borderColor: isSelected(img.url) ? 'primary.main' : 'grey.400',
                                                backgroundColor: isSelected(img.url) ? 'primary.main' : 'white',
                                                color: isSelected(img.url) ? 'white' : 'inherit',
                                                zIndex: 2,
                                            }}
                                            title={isSelected(img.url) ? 'Deselect' : 'Select for collage'}
                                        >
                                            {isSelected(img.url) && <CheckIcon sx={{ fontSize: 16 }} />}
                                        </IconButton>

                                        <Box onClick={() => setShowImage(img.url)}>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: 140,
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 1,
                                                    mt: 4
                                                }}
                                            >
                                                <LazyImage src={img.url} alt={img.displayName} />
                                            </Box>
                                            <Typography variant="body2" noWrap>
                                                {img.displayName}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}

            {selected.length > 0 && !createCollage && (
                <Box mb={3} textAlign="center">
                    <Button
                        onClick={() => {
                            setCollageSelection(selected);
                            setCreatCollage(true);
                            setSelected([]);
                        }}
                        sx={GradientButton}
                    >
                        Create Collage ({selected.length})
                    </Button>
                </Box>
            )}

            {createCollage && (
                <>
                    <Box mt={3} textAlign="center">
                        <Button
                            onClick={() => {
                                setCreatCollage(false);
                            }}
                            sx={gradientBorderButton}
                            style={{ width: '30vw', height: '40', minHeight: 'min-content', marginBottom: 40 }}
                        >
                            <img src={arrow} alt="arow icon" style={{ width: '20px', height: '20px', objectFit: 'cover', }} /> <span style={{ marginRight: 13, marginLeft: 13 }}>Back to image selection</span>  <img src={arrow} alt="arow icon" style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
                        </Button>
                    </Box>

                    <FancyCollage images={collageSelection} />
                </>
            )}

            {showImage && <ShowImage closeImage={setShowImage} fileName={showImage} />}
        </Box>
    );
};

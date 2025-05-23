import { Box, Typography, IconButton} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import backgroundPic from '../../assets/pictures/emptyBackground.png'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: 'auto',
        py: 6,
        px: { xs: 2, md: 6 },
        color: '#fff',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 4,
        zIndex: 0,
      }}
    >

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundPic})`,
          width: "100vw",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)',
          zIndex: -2,
        }}
      />

      <Box>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography>Phone: +972 58-324-3025</Typography>
        <Typography>Email: pixhive@gmail.com</Typography>
        <Typography>Address: 97 Broadway Street, NY</Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Follow Us
        </Typography>
        <IconButton color="inherit" href="https://facebook.com" target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" href="https://instagram.com" target="_blank">
          <InstagramIcon />
        </IconButton>
        <IconButton color="inherit" href="https://linkedin.com" target="_blank">
          <LinkedInIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="h6" gutterBottom>
          Quick Links
        </Typography>
        <Typography><a href="/gallery" style={{ color: '#fff' }}>Gallery</a></Typography>
        <Typography><a href="/upload-image" style={{ color: '#fff' }}>Upload Image</a></Typography>
        <Typography><a href="/collage" style={{ color: '#fff' }}>Create Collage</a></Typography>

      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Typography variant="body2">
          © 2025 PixHive-ChayaEtorg. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

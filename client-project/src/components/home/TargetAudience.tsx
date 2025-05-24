import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const StarIcon = () => (
  <motion.div
    whileHover={{ rotate: 360 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    style={{
      display: 'inline-block',
      width: 50,
      height: 50,
      background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
      WebkitMaskImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><path fill=\'white\' d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/></svg>")',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><path fill=\'white\' d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/></svg>")',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      maskSize: 'contain',
      cursor: 'pointer',
    }}
  />
);

const features = [
  {
    title: 'Photographers',
    description: 'Manage and showcase your photo collections with ease and style.',
  },
  {
    title: 'Creative Teams',
    description: 'Collaborate and organize media projects efficiently in one place.',
  },
  {
    title: 'Artists & Creators',
    description: 'Display your artwork and visual content with professional tools.',
  },
];

const pathData =
  "M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5"

const transition = {
  duration: 6,
  ease: 'easeInOut',
  repeat: Infinity,
};

const TargetAudience = () => {
  return (
    <Box sx={{ bgcolor: 'rgba(206, 204, 204, 0.14)', height: '100vh', display: 'flex' }}>
      <Box
        component={motion.div}
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontWeight: 'bold',
          fontSize: '60px',
          p: 4,
          color: 'primary.main',
          height: '100%',
          width: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(to top, #47dcd1 , #dc8dec)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Who is this for?
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {features.map((item, index) => (

          <Box
            key={index}
            sx={{ position: 'relative', height: 460, width: '100%', maxWidth: '85vw', overflow: 'visible' }}
            component={motion.div}
            custom={index}
          >

            <motion.svg
              width="50%"
              height="450"
              viewBox="0 0 1380 1500"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 200, overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ff0b7" />
                  <stop offset="100%" stopColor="#8c52ff" />
                </linearGradient>
              </defs>
              <g transform="translate(100,-100)">
                <motion.path
                  d={pathData}
                  fill="transparent"
                  stroke="url(#gradientStroke)"
                  strokeWidth={4}
                  initial={{ pathLength: 0.001 }}
                  animate={{ pathLength: 1 }}
                  transition={transition}
                />
              </g>
            </motion.svg>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.4 }}
              style={{ width: '100%', willChange: 'transform' }}
            >
              <Box
                sx={{
                  width: '100%',
                  p: '2px',
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
                }}
              >
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.97)',
                    p: 2,
                    borderRadius: 4,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <Box>
                    <StarIcon />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </Box>
        ))
        }
      </Box >
    </Box >
  );
};

export default TargetAudience;
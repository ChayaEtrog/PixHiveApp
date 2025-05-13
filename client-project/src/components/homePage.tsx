import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
// import { TypeAnimation } from "react-type-animation";

const sections = [
  {
    id: 1,
    background: "linear-gradient(45deg, #47dcd1, #dc8dec)",
    content: (
      <>
        <motion.img
          src="https://via.placeholder.com/150"
          alt="Hero"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ width: 150, marginBottom: 20 }}
        />
        <Typography variant="h2" color="white">
          Welcome to Magic
        </Typography>
      </>
    ),
  },
  {
    id: 2,
    background: "linear-gradient(to right, #dc8dec, #8ec5fc)",
    content: (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h3" color="white">
          Our Vision
        </Typography>
        <Typography variant="body1" color="white" mt={2}>
          We are building a magical world.
        </Typography>
      </motion.div>
    ),
  },
//   {
//     id: 3,
//     background: "radial-gradient(circle at center, #47dcd1, #dc8dec)",
//     content: (
//     //   <TypeAnimation
//     //     sequence={['Innovate', 1000, 'Create', 1000, 'Inspire', 1000]}
//     //     wrapper="h2"
//     //     style={{ fontSize: '3rem', color: 'white' }}
//     //     repeat={Infinity}
//     //   />
//     ),
//   },
  {
    id: 4,
    background: "linear-gradient(to bottom right, #a18cd1, #fbc2eb)",
    content: (
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        initial="hidden"
        whileInView="visible"
      >
        <motion.path
          d="M10 80 C 40 10, 65 10, 95 80"
          fill="transparent"
          stroke="#fff"
          strokeWidth="5"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1, transition: { duration: 3 } },
          }}
        />
      </motion.svg>
    ),
  },
  {
    id: 5,
    background: "linear-gradient(45deg, #dc8dec, #47dcd1)",
    content: (
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Typography variant="h4" color="white">
          Spring In!
        </Typography>
      </motion.div>
    ),
  },
  {
    id: 6,
    background: "linear-gradient(90deg, #ffdde1, #ee9ca7)",
    content: (
      <motion.div
        style={{ width: 100, height: 100, borderRadius: '50%', background: '#fff' }}
        animate={{ x: [0, 100, -100, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    ),
  },
  {
    id: 7,
    background: "linear-gradient(60deg, #43cea2, #185a9d)",
    content: (
      <Typography variant="h4" color="white">
        Let it Flow
      </Typography>
    ),
  },
  {
    id: 8,
    background: "linear-gradient(to top left, #ffecd2, #fcb69f)",
    content: (
      <motion.div
        style={{ fontSize: '2rem', color: 'white' }}
        animate={{ y: [0, -10, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Wavy Element
      </motion.div>
    ),
  },
  {
    id: 9,
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    content: (
      <Typography variant="h6" color="white">
        The End - Thank You!
      </Typography>
    ),
  },
];

const HomePage = () => {
  return (
    <Box>
      {sections.map((section) => (
        <Box
          key={section.id}
          component={motion.section}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: section.background,
            textAlign: "center",
            p: 4,
          }}
        >
          {section.content}
        </Box>
      ))}
    </Box>
  );
};

export default HomePage;

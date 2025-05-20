import { Accordion, AccordionSummary, AccordionDetails, Box, Container, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

const faqItems = [
  {
    question: "How do I start uploading my photos?",
    answer: "Simply sign up for an account, log in, and click the 'Upload' button on your dashboard to start uploading your images.",
  },
  {
    question: "Can I search for photos by tags or dates?",
    answer: "Absolutely. Use our smart search bar to find photos by title, tags, album name, or upload date.",
  },
  {
    question: "Can I organize my photos into albums or folders?",
    answer: "Yes! You can create albums, organize photos into folders, and even nest albums within other albums for better structure.",
  },
  {
    question: "Can I download my photos later?",
    answer: "Of course. You can download individual photos or entire albums at any time from your dashboard.",
  },
  {
    question: "Is my data safe and private?",
    answer: "Your data is securely stored in the cloud with encryption. Only you (and those you share with) can access your private albums.",
  },
]

export default function FaqSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false)

  const handleChange = (index: number) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedIndex(isExpanded ? index : false)
  }

  return (

      <Box
        component="section"
        sx={{
          py: { xs: 12, md: 16 },
          backgroundColor: 'transparent',
          height: '64vh'
        }}
      >
        <Container maxWidth="md">
          {/* <Box textAlign="center" mb={6}> */}
          <div style={{ position: "relative", height: "180px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "24px" }}>
            {/* רקע מעורפל אנימטיבי */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: 800,
                height: 50,
                borderRadius: 100,
                background: "radial-gradient(circle at 30% 30%,rgb(23, 200, 194), rgb(255, 0, 255),rgb(255, 0, 255))",
                filter: "blur(60px)",
                zIndex: 0,
              }}
            />

            {/* טקסט */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                zIndex: 1,
                fontWeight: 700,
                color: "rgba(91, 91, 91, 0.85)",
              }}
            >
              Frequently Asked Questions
            </Typography>
          </div>
          <Box>
            {faqItems.map((item, index) => (
              <Accordion
                key={index}
                expanded={expandedIndex === index}
                onChange={handleChange(index)}
                square
                disableGutters
                elevation={0}
                sx={{
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                  <Typography variant="h6" fontWeight="medium">
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Typography variant="body1" color="text.secondary">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>
  )
}

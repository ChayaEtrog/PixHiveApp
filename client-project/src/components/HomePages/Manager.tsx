import { Box } from "@mui/material"

import HomePage from "./HomePage"
import FeaturesPage from "./FeaturesPage"
import TestimonialsPage from "./TestimonialsPage"
import { motion } from "framer-motion"
import FAQPage from "./FAQPage "


const Manager = () => {
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto',overflowX:'hidden' }}>
            <HomePage />
            <FeaturesPage />
            <TestimonialsPage/>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
            >
                <FAQPage />
            </motion.div>
        </Box>
    )
}

export default Manager
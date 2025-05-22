import { Box } from "@mui/material"
import FeaturesPage from "./FeaturesPage"
import TestimonialsPage from "./TestimonialsPage"
import { motion } from "framer-motion"
import FAQPage from "./FAQPage "
import TargetAudience from "./TargetAudience"
import Footer from "./Footer"
import GetStartedManager from "./GetStartedManager"


const HomeContainer  = () => {
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <GetStartedManager/>
            <FeaturesPage />
            <TestimonialsPage />
            <TargetAudience />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
            >
                <FAQPage />
            </motion.div>
            <Footer/>
        </Box>
    )
}

export default HomeContainer 
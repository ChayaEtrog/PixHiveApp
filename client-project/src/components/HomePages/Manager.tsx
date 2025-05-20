import { Box } from "@mui/material"
import FAQPage from "./CommonQuestions"
import HomePage from "./HomePage"
import { motion } from "framer-motion"

const Manager = () => {
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto' }}>
            <HomePage />
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
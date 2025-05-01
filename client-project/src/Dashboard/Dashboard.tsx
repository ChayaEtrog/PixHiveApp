import { Box, Button, Typography } from "@mui/material"
import UpdateFormModal from "./UpdateFormModal"
import UserStatesPage from "./UserStatesPage"
import { useContext, useState } from "react"
import { UserContext } from "../components/user/UserReducer"
import { gradientBorderButton,GradientButton } from "../styles/buttonsStyle"

const Dhashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user } = useContext(UserContext)
    return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginTop="110px"
            >
                <Typography variant="h4" gutterBottom>
                    User Details
                </Typography>

                <Box textAlign="center" mb={3}>
                    <Typography variant="h6">Name: {user.userName}</Typography>
                    <Typography variant="h6">Phone: {user.phoneNumber}</Typography>
                    <Typography variant="h6">Email: {user.email}</Typography>
                </Box>
                <Button sx={GradientButton} style={{height:40, marginBottom:'30px'}} onClick={()=>{setIsModalOpen(true)}}>update</Button>

                {isModalOpen && <UpdateFormModal setIsOpen={setIsModalOpen} />}
                <UserStatesPage />
            </Box>
    )
}

export default Dhashboard
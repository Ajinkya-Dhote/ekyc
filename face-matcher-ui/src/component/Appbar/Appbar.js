import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function Appbar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Face Verification Demo
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';

const Header = ()=>{
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Bhakta Feeder Importer
                    </Typography>
                    <Typography variant="h6" style={{
                        marginRight: '1rem',
                    }}>Hi, MTSI</Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
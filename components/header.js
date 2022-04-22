
import {Menu, MenuItem} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Header = ()=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const router = useRouter();
    let fullname = "";
    try {
        fullname = localStorage.getItem('fullname');
    } catch (error) {
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('fullname');
        router.push('/login');
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Bhakta Feeder Importer
                    </Typography>
                    <Typography variant="h6" style={{
                        marginRight: '1rem',
                    }}>Hi, {fullname}</Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        color="inherit"
                        id="menu-profile-button"
                        aria-controls={open ? 'menu-profile' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                        }}
                    >
                        <PersonIcon />
                    </IconButton>

                    <Menu
                        id="menu-profile"
                        aria-labelledby="menu-profile-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem id='menu-1' onClick={(e) => {
                            logout();
                        }}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
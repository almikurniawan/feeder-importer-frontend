import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { blue } from '@mui/material/colors';
import Link from 'next/link';

const MenuFeeder = () => {
    const drawerWidth = 240;

    const menuItem = [
        {
            name: 'Kelas Kuliah',
            url: '/kelas/list',
            icon: <HomeOutlinedIcon />,
        },
        {
            name: 'KRS',
            url: '/krs/list',
            icon: <HomeOutlinedIcon />,
        },
        {
            name: 'Nilai Perkuliahan',
            url: '/',
            icon: <MenuBookOutlinedIcon />,
        },
        {
            name: 'Biodata Mahasiswa',
            url: '/mahasiswa/list',
            icon: <PersonOutlineOutlinedIcon />,
        },
        {
            name: 'AKM',
            url: '/akm/list',
            icon: <PersonOutlineOutlinedIcon />,
        },
        {
            name: 'Nilai Transfer',
            url: '/nilai_trf/list',
            icon: <PersonOutlineOutlinedIcon />,
        },
        
    ];
    return (
        <Drawer
            variant="permanent"
            color="primary"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}
                style={{
                    // backgroundColor: blue[50],
                    height: '100vh',
                }}
            >
                <List>
                    {menuItem.map((value, index) => (
                        <Link href={value.url} key={index}>
                            <ListItem button key={value.name}>
                                <ListItemIcon>
                                    {value.icon}
                                </ListItemIcon>
                                <ListItemText primary={value.name} style={{
                                    // color: '#fff',
                                }} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default MenuFeeder;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    InputBase,
    styled,
    Avatar,
    Menu,
    MenuItem,
    Button,
    Hidden,
} from '@mui/material';
import { alpha } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import icLauncher from '../assets/ic_launcher.png';

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 1rem',
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: '60ch', // Increase maxWidth
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30ch', // Increase width
            '&:focus': {
                width: '40ch', // Increase focused width
            },
        },
    },
}));

const Navbar = ({ user, handleLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (route) => {
        navigate(route);
        handleClose();
    };

    return (
        <AppBar position="sticky" top="64px">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="icon">
                    <img src={icLauncher} alt="App Icon" height="32" width="32" />
                </IconButton>
                <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ flexGrow: 0, marginRight: 1 }}
                >
                    AI头条管理员平台
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    {/* Desktop buttons */}
                    <Hidden smDown>
                        <Button color="inherit" onClick={() => navigate('/home')}>
                            首页
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/user-management')}
                        >
                            用户管理
                        </Button>
                    </Hidden>

                    {/* Mobile menu */}
                    <Hidden mdUp>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => handleMenuClick('/')}>
                                首页
                            </MenuItem>
                            <MenuItem onClick={() => handleMenuClick('/user-management')}>
                                用户管理
                            </MenuItem>
                            <MenuItem sx={menuItemStyle}>
                                <SettingsIcon />
                                设置
                            </MenuItem>
                            <MenuItem sx={menuItemStyle} onClick={handleLogout}>
                                <ExitToAppIcon />
                                登出
                            </MenuItem>
                        </Menu>
                    </Hidden>
                </Box>


                {/* Search bar */}
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Avatar
                    src={user.profileImage}
                    alt={user.name}
                    sx={{ mr: 2 }}
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem sx={menuItemStyle}>
                        <SettingsIcon />
                        Settings
                    </MenuItem>
                    <MenuItem sx={menuItemStyle} onClick={handleLogout}>
                        <ExitToAppIcon />
                        Logout
                    </MenuItem>
                </Menu>
                <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ flexGrow: 0, marginRight: 1 }}
                >
                    {user.name}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
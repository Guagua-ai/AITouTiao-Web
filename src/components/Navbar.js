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
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import icLauncher from '../assets/ic_launcher.png';
import { searchArticles } from '../services/articles';

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

    const handleSearch = async (searchQuery) => {
      try {
        const response = await searchArticles(searchQuery);
        
        // Navigate to the search results page and pass the results as a prop
        navigate('/search-results', { state: { results: response.data.results } });
      } catch (error) {
        console.error('Error searching for posts:', error);
      }
    };

    const handleSearchSubmit = (event) => {
      event.preventDefault();
      const searchQuery = event.target.searchQuery.value;
      handleSearch(searchQuery);
    };

    return (
        <AppBar position="sticky" top="64px">
            <Toolbar>
                <Hidden smDown>
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
                </Hidden>
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
                </Box>


                {/* Search bar */}
                <form onSubmit={handleSearchSubmit}>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            name="searchQuery"
                            placeholder="搜索…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </form>

                <Box sx={{ flexGrow: 1 }}></Box>
                <Hidden smDown>
                    <Button color="inherit" onClick={handleClick} >
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Avatar
                            src={user.profileImage}
                            alt={user.name}
                            sx={{ mr: 1 }}
                            style={{ cursor: 'pointer' }}
                        />
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ flexGrow: 0, marginRight: 1 }}
                        >
                            {user.name}
                        </Typography>
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
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

                
                {/* Mobile menu */}
                <Hidden mdUp>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleClick}
                        sx={{ width: 56 }} // Increase the width here
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem sx={menuItemStyle} onClick={() => handleMenuClick('/home')}>
                            <HomeIcon />
                            首页
                        </MenuItem>
                        <MenuItem sx={menuItemStyle} onClick={() => handleMenuClick('/user-management')}>
                            <PersonIcon />
                            用户
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
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
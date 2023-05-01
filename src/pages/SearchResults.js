import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';
import { refreshAccessToken, validateAccessToken, handleLogout } from '../services/auth';
import { Container, Button } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

import Navbar from '../components/Navbar';

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];
    const [user, setUser] = useState({});

    useEffect(() => {
        const validateToken = async () => {
            if (!localStorage.getItem('accessToken')) {
                window.location.href = '/login';
                return;
            }
            try {
                const response = await validateAccessToken();
                if (response.status !== 200) {
                    window.location.href = '/login';
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Access token expired, try to refresh it
                    const tokenRefreshed = await handleTokenExpiration();
                    if (!tokenRefreshed) {
                        window.location.href = '/login';
                    }
                } else {
                    console.error('Failed to validate token:', error);
                    window.location.href = '/login';
                }
            }
        };

        validateToken();
        const userInfo = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            profileImage: localStorage.getItem('profileImage'),
        };
        setUser(userInfo);
        console.log('results: ', results);
    }, []);

    const handleTokenExpiration = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await refreshAccessToken(refreshToken);

        if (refreshResponse.status === 200) {
            // Access token refreshed successfully, store the new token
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
            return true;
        } else {
            // Refresh token expired or failed, remove tokens and redirect the user to the login page
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return false;
        }
    };  

    return (
        <>
            {/* Add the navigation bar */}
            <Navbar user={user} handleLogout={handleLogout} />

            <Container maxWidth="lg">
                {/* Add the search results */}
                <Box>
                    <Box sx={{ marginTop: 4 }}>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#FFFFFF', // Change the color to your preferred color
                            }}
                        >
                            搜索结果
                        </Typography>
                </Box>
                {results.map((searchResult, index) => (
                    <Card key={index} sx={{ marginBottom: 2, padding: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {searchResult.author}
                                        </Typography>
                                        {
                                            searchResult.visibility === 'public' ?
                                                <Button color="secondary">
                                                    <PublicIcon sx={{ "marginRight": 1 }} />
                                                    已公开
                                                </Button>
                                                :
                                                <Button color="warning">
                                                    <LockIcon sx={{ "marginRight": 1 }} />
                                                    审核中
                                                </Button>
                                        }
                                    </Box>
                                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                        {searchResult.title}
                                    </Typography>
                                    <Typography variant="body1" component="p" sx={{ marginBottom: 1 }}>
                                        {searchResult.content}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <CardMedia
                                component="img"
                                height="200"
                                width="200"
                                image={searchResult.urlToImage}
                                alt={searchResult.title}
                                sx={{ objectFit: 'cover', height: '200px', width: '200px', borderRadius: '4px', marginLeft: 2 }}
                            />
                        </Box>
                    </Card>
                ))}
                </Box>
            </Container>
        </>
    );
};

export default SearchResults;

import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import {
    Container,
    Button,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import Navbar from '../components/Navbar';


const fetchArticles = async (since_id = 0, per_page = 10) => {
    try {
        const response = await fetch(
            // `https://news.virtualdynamiclab.com/tweets/pagination?since_id=${since_id}&per_page=${per_page}`
            `https://news.virtualdynamiclab.com/tweets`
        );
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
};


const Home = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [user, setUser] = useState({});
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const userInfo = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            profileImage: localStorage.getItem('profileImage'),
        };
        setUser(userInfo);

        const loadArticles = async () => {
            const fetchedArticles = await fetchArticles();
            setArticles(fetchedArticles);
        };
        loadArticles();
    }, []);

    const handleButtonClick = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://news.virtualdynamiclab.com/collect_async', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(response.data);
            setAnimate(true);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Access token expired, try to refresh it
                const refreshToken = localStorage.getItem('refreshToken');
                const refreshResponse = await refreshAccessToken(refreshToken);

                if (refreshResponse.status === 200) {
                    // Access token refreshed successfully, store the new token and retry the request
                    localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                    await handleButtonClick();
                } else {
                    // Refresh token failed, redirect the user to the login page
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else if (error.response && error.response.status === 422) {
                console.error('Validation error:', error.response.data);
            } else {
                console.error('Error fetching news:', error);
            }
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('profileImage');
        window.location.href = '/';
    };

    const fadeInUp = useSpring({
        from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
        to: { opacity: animate ? 1 : 0, transform: animate ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)' },
        config: { duration: 1000 },
    });

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post('https://news.virtualdynamiclab.com/auth/refresh', {
                refreshToken,
            });
            return {
                status: response.status,
                data: {
                    accessToken: response.data.accessToken,
                },
            };
        } catch (error) {
            if (error.response) {
                return {
                    status: error.response.status,
                    data: null,
                };
            } else {
                return {
                    status: 500,
                    data: null,
                };
            }
        }
    };

    return (
        <>
            <Navbar user={user} handleLogout={handleLogout} />
            <Container maxWidth="lg">
                <Grid container>
                    {/* Left side: Welcome and Fetch button */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Box
                            sx={{
                                position: 'sticky',
                                top: '80px',
                                minWidth: '100px',
                                mr: 2,
                                mt: 4,
                                display: 'flex',
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <Typography component="h1" variant="h4" gutterBottom>
                                    欢迎
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                    抓取平台最新咨询
                                </Typography>
                                <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleButtonClick}
                                        disabled={loading}
                                        sx={{ mr: 2 }}
                                    >
                                        {loading ? <CircularProgress size={24} /> : '获取新闻'}
                                    </Button>
                                </Box>
                                <animated.div style={fadeInUp}>
                                    <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
                                        新闻抓取成功！
                                    </Typography>
                                </animated.div>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Right side: Card content */}
                    <Grid item xs={12} sm={8} md={8}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                {articles.map((article) => (
                                    <Grid item xs={12} key={article.id}>
                                        <Card sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Grid container>
                                                <Grid item xs={12} sm={10}>
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div" align='left'>
                                                            {article.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" align='left'>
                                                            {article.content}
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <CardMedia
                                                        component="img"
                                                        height="120"
                                                        width="20"
                                                        image={article.urlToImage}
                                                        alt={article.title}
                                                        sx={{ objectFit: 'fill', minWidth: '10' }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Home;
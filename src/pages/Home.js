import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import Navbar from '../components/Navbar';
import StickyPanel from '../components/StickyPanel';
import { refreshAccessToken, handleLogout } from '../services/auth';
import { fetchArticles, deleteArticle } from '../services/articles';
import EditArticle from '../components/EditArticle';

const Home = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [user, setUser] = useState({});
    const [articles, setArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);

    useEffect(() => {
        const userInfo = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            profileImage: localStorage.getItem('profileImage'),
        };
        setUser(userInfo);
        loadArticles();
    }, []);

    const loadArticles = async () => {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
    };

    const handleClick = async () => {
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
                    await handleClick();
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

    const updateArticle = async (updatedArticle) => {
        try {
            const response = await axios.put(
                `https://news.virtualdynamiclab.com/tweets/${updatedArticle.id}`,
                updatedArticle,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to update article:', error);
            return null;
        }
    };    

    const handleArticleUpdated = async (updatedArticle) => {
        const updatedData = await updateArticle(updatedArticle);
        if (updatedData) {
            setEditingArticle(null);

            // Reload articles after updating the article
            loadArticles();
        }
    };

    const handleEditArticle = (article) => {
        setEditingArticle(article);
    };

    const handleDeleteButtonClick = (articleId) => {
        setArticleToDelete(articleId);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (articleToDelete) {
            try {
                await deleteArticle(articleToDelete.id, accessToken);
                loadArticles();
            } catch (error) {
                console.error('Failed to delete article:', error);
            }

            setConfirmDialogOpen(false);
            setArticleToDelete(null);
        }
    };    

    return (
        <>
            {/* ... EditArticle and Navbar ... */}
            {editingArticle && (
                <EditArticle
                    article={editingArticle}
                    onUpdate={handleArticleUpdated}
                    onClose={() => setEditingArticle(null)}
                />
            )}

            {/* Add the confirmation dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>删除文章</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        确定要删除这篇文章吗？此操作无法撤销。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>
                        取消
                    </Button>
                    <Button color="error" onClick={handleConfirmDelete}>
                        删除
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add the navigation bar */}
            <Navbar user={user} handleLogout={handleLogout} />

            {/* Add the main content */}
            <Container maxWidth="lg">
                <Grid container>
                    {/* Left side: Welcome and Fetch button */}
                    <Grid item xs={12} sm={4} md={4}>
                        <StickyPanel accessToken={accessToken} handleButtonClick={handleClick} />
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
                                                {/* Add the "Delete" button */}
                                                <Grid item xs={12} sm={12}>
                                                    <Button
                                                        sx={{ width: '50%' }}
                                                        onClick={() => handleEditArticle(article)}>修改</Button>
                                                    <Button color="error"
                                                        sx={{ width: '50%' }}
                                                        onClick={() => handleDeleteButtonClick(article)}>删除</Button>
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
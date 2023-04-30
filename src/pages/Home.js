import React, { useState, useEffect } from 'react';
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
    Menu,
    MenuItem,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';


import Navbar from '../components/Navbar';
import StickyPanel from '../components/StickyPanel';
import { refreshAccessToken, validateAccessToken, handleLogout } from '../services/auth';
import { collectArticles, addArticle, fetchArticles, updateArticle, deleteArticle, lgtmArticle, flagArticle } from '../services/articles';

import EditArticle from '../components/EditArticle';
import AddArticle from '../components/AddArticle';

const Home = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [articles, setArticles] = useState([]);
    const [user, setUser] = useState({});
    const [addingArticle, setAddingArticle] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [approveArticle, setApproveArticle] = useState(null);
    const [reviewArticle, setReviewArticle] = useState(null);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

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
        loadArticles();
    }, []);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const loadArticles = async () => {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
    };

    const handleCollectAsync = async () => {
        return await collectArticles(handleTokenExpiration, handleCollectAsync);
    };

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

    const handleArticleUpdated = async (article) => {
        const updatedData = await updateArticle(handleTokenExpiration, article);
        if (updatedData) {
            setEditingArticle(null);
            loadArticles();
        }
    };

    const handleEditArticle = (article) => {
        setEditingArticle(article);
    };

    const handleArticleAdded = async (article) => {
        const addedData = await addArticle(article);
        if (addedData) {
            setAddingArticle(null);
            loadArticles();
        }
    };

    const handleLgtmAtricle = async (article) => {
        const updatedData = await lgtmArticle(handleTokenExpiration, article.id);
        if (updatedData) {
            setApproveArticle(null);
            loadArticles();
        } else {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    };
    
    const handleReviewArticle = async (article) => {
        const updatedData = await flagArticle(handleTokenExpiration, article.id);
        if (updatedData) {
            setReviewArticle(null);
            loadArticles();
        } else {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    };

    const handleDeleteButtonClick = (articleId) => {
        setArticleToDelete(articleId);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (articleToDelete) {
            try {
                await deleteArticle(articleToDelete.id);
                loadArticles();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Access token expired, try to refresh it
                    const tokenRefreshed = await handleTokenExpiration();

                    if (tokenRefreshed) {
                        // Retry the request
                        await handleConfirmDelete();
                    }
                } else {
                    console.error('Failed to delete article:', error);
                }
            }

            setConfirmDialogOpen(false);
            setArticleToDelete(null);
        }
    };    

    return (
        <>
            {/* Add the AddArticle component */}
            {addingArticle && (
                <AddArticle
                    onAdd={handleArticleAdded}
                    onClose={() => setAddingArticle(false)}
                />
            )}
            
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
                        <StickyPanel handleButtonClick={handleCollectAsync} onAddArticle={() => setAddingArticle(true)} />
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
                                                        { 
                                                            article.visibility === 'public' ? 
                                                                <Button color="secondary"
                                                                    sx={{ width: '100%' }} 
                                                                >
                                                                    <PublicIcon sx={{ "marginRight": 1 }} />
                                                                        已公开
                                                                </Button> 
                                                                :
                                                                <Button color="warning"
                                                                    sx={{ width: '100%' }}
                                                                >
                                                                    <LockIcon sx={{ "marginRight": 1 }} />
                                                                        审核中
                                                                </Button>
                                                        }
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

                                                <Grid item xs={12} sm={12}>
                                                    <Button
                                                        sx={{ width: '25%' }}
                                                        onClick={() => handleEditArticle(article)}
                                                    >
                                                        <EditIcon sx={{"marginRight": 1}} />
                                                            修改
                                                    </Button>
                                                    <Button 
                                                        color="success"
                                                        sx={{ width: '25%' }}
                                                        onClick={() => handleLgtmAtricle(article)}
                                                    >
                                                        <ThumbUpIcon sx={{"marginRight": 1}} />
                                                            批准
                                                    </Button>
                                                    <Button 
                                                        color="warning"
                                                        sx={{ width: '25%' }}
                                                        onClick={() => handleReviewArticle(article)}
                                                    >
                                                        <ThumbDownIcon sx={{"marginRight": 1}} />
                                                            审核
                                                    </Button>
                                                    <Button 
                                                         sx={{ width: '25%' }}
                                                        onClick={handleMenuClick}>
                                                        <MoreVertIcon />
                                                    </Button>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleMenuClose}
                                                        >
                                                            <MenuItem onClick={() => {
                                                                handleDeleteButtonClick(article);
                                                                handleMenuClose();
                                                            }}>
                                                            <DeleteIcon sx={{"marginRight": 1, "color": "error.main"}} />
                                                                删除
                                                            </MenuItem>
                                                        </Menu>
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

            {/* Add the alert */}
            {showAlert && <Alert
                sx={{
                    position: 'sticky',
                    bottom: 0,
                }}
                severity="error">操作失败!</Alert>}
        </>
    );
};

export default Home;
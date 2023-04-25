import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    TextField,
    Typography,
    Box,
    CssBaseline,
    CircularProgress,
    Paper,
} from '@mui/material';
import axios from 'axios';
import icLauncher from '../assets/ic_launcher.png';

const styles = {
    paper: {
        marginTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
    },
    avatar: {
        margin: '8px',
        backgroundColor: 'secondary.main',
    },
    form: {
        width: '100%',
        marginTop: '8px',
    },
    submit: {
        marginTop: '16px',
        marginBottom: '8px',
    },
};

const authenticateUser = async (email, password) => {
    try {
        const response = await axios.post('https://news.virtualdynamiclab.com/auth/login', {
            email,
            password,
        });
        return {
            status: response.status,
            data: {
                name: response.data.user.name,
                accessToken: response.data.user.accessToken,
                refreshToken: response.data.user.refreshToken,
                profileImage: response.data.user.profileImage,
                email: response.data.user.email,
            },
        };
    } catch (error) {
        // Handle errors, e.g., network issues or wrong credentials
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


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const response = await authenticateUser(email, password);
        if (response.status === 200) {
            if (!response.data.accessToken) {
                setLoading(false);
                setError('Missing access token. Please try again.');
                return;
            }
            if (!response.data.refreshToken) {
                setLoading(false);
                setError('Missing refresh token. Please try again.');
                return;
            }
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('profileImage', response.data.profileImage);
            localStorage.setItem('accessToken', response.data.accessToken); // Update this line
            localStorage.setItem('refreshToken', response.data.refreshToken); // Update this line
            navigate('/home');
        } else {
            alert('Login failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} sx={{ ...styles.paper, width: '100%' }}>
                <img src={icLauncher} alt="Logo" height={32} width={32} />
                <Typography component="h1" variant="h5">
                    AI头条管理员平台
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={styles.submit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
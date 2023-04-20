import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Button, Typography, Box, CircularProgress, Paper } from '@mui/material';

const LeftPanel = ({ accessToken, handleButtonClick }) => {
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);

    const fadeInUp = useSpring({
        from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
        to: { opacity: animate ? 1 : 0, transform: animate ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)' },
        config: { duration: 1000 },
    });

    const handleClick = async () => {
        setLoading(true);
        await handleButtonClick();
        setLoading(false);
        setAnimate(true);
    };

    return (
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
                    <Button variant="contained" onClick={handleClick} disabled={loading} sx={{ mr: 2 }}>
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
    );
};

export default LeftPanel;

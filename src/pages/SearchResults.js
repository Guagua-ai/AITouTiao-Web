import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { handleLogout } from '../services/auth';

const SearchResults = ({ searchResults }) => {
    const location = useLocation();
    const results = location.state?.searchResults || [];
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
    }, []);

  return (
    <>
        {/* Add the navigation bar */}
        <Navbar user={user} handleLogout={handleLogout} />

        {/* Add the search results */}
        <Box>
        <Typography variant="h4" component="h1" gutterBottom>
            Search Results
        </Typography>
        {searchResults.map((searchResult, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>                                                       
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
                <Typography variant="h6" component="h2">
                {searchResult.title}
                </Typography>
                <Typography variant="body1" component="p">
                {searchResult.content}
                </Typography>
            </CardContent>
            </Card>
        ))}
        </Box>
    </>
  );
};

export default SearchResults;

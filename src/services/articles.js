import axios from 'axios';
import { COLLECT_ASYNC, TWEETS_API_URL } from './constants';

const collectArticles = async (handleTokenExpiration, handleButtonClick) => {
    try {
        const response = await axios.get(
            COLLECT_ASYNC, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return (response.status === 200 || response.status === 201 || response.status === 202);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Access token expired, try to refresh it
            const tokenRefreshed = await handleTokenExpiration();

            if (tokenRefreshed) {
                // Retry the request
                await handleButtonClick();
            }
        } else if (error.response && error.response.status === 422) {
            console.error('Validation error:', error.response.data);
        } else {
            console.error('Error fetching news:', error);
        }
    }
    return false;
};

const fetchArticles = async (since_id = 0, per_page = 10) => {
    try {
        const response = await axios.get(
            TWEETS_API_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        const data = response.data;
        return data.articles;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
};

const updateArticle = async (handleTokenExpiration, updatedArticle) => {
    try {
        const response = await axios.put(
            TWEETS_API_URL + `/${updatedArticle.id}`,
            {
                "title": updatedArticle.title,
                "description": updatedArticle.description,
                "author": updatedArticle.author,
                "displayname": updatedArticle.displayname,
                "url": updatedArticle.url,
                "urlToImage": updatedArticle.urlToImage,
                "content": updatedArticle.content,
                "source_id": updatedArticle.source.id,
                "source_name": updatedArticle.source.name,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Access token expired, try to refresh it
            const tokenRefreshed = await handleTokenExpiration();

            if (tokenRefreshed) {
                // Retry the request
                return await updateArticle(handleTokenExpiration, updatedArticle);
            }
        } else {
            console.error('Failed to update article:', error);
        }
        return null;
    }
};    

const deleteArticle = async (articleId) => {
    try {
        await axios.delete(
            TWEETS_API_URL + `/${articleId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
};


export {
    collectArticles,
    fetchArticles,
    updateArticle,
    deleteArticle,
};
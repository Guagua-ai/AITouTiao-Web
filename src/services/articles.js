import axios from 'axios';

const TWEETS_GET_URL = 'https://news.virtualdynamiclab.com/admin/tweets';
const TWEETS_GET_PAGINATION_URL = 'https://news.virtualdynamiclab.com/tweets/pagination';

const fetchArticles = async (since_id = 0, per_page = 10) => {
    try {
        const response = await axios.get(
            TWEETS_GET_URL, {
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

const deleteArticle = async (articleId, accessToken) => {
    await axios.delete(`https://news.virtualdynamiclab.com/admin/tweets/${articleId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};


export {
    fetchArticles,
    deleteArticle,
};
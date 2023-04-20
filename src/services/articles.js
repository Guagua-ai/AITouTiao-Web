import axios from 'axios';

const TWEETS_GET_URL = 'https://news.virtualdynamiclab.com/tweets';
const TWEETS_GET_PAGINATION_URL = 'https://news.virtualdynamiclab.com/tweets/pagination';

const fetchArticles = async (since_id = 0, per_page = 10, accessToken = null) => {
    try {
        let response;
        if (accessToken == null) {
            response = await axios.get(
                TWEETS_GET_URL,
            );
        } else {
            response = await axios.get(
                TWEETS_GET_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
        const data = response.data;
        return data.articles;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
};

const deleteArticle = async (articleId, accessToken) => {
    await axios.delete(`https://news.virtualdynamiclab.com/tweets/${articleId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};


export {
    fetchArticles,
    deleteArticle,
};
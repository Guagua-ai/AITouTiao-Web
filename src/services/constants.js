const LOCAL_ENDPOINT = 'http://localhost:8080';
const REMOTE_ENDPOINT = 'https://news.virtualdynamiclab.com';
const ENDPOINT = REMOTE_ENDPOINT;

// Auth APIs
const AUTH_API_URL = ENDPOINT + '/auth';
const AUTH_API_REFRESH_URL = AUTH_API_URL + '/refresh';
const AUTH_API_VALIDATE_URL = AUTH_API_URL + '/validate_token';
const AUTH_API_LOGIN_URL = AUTH_API_URL + '/login';
const AUTH_API_REGISTER_URL = AUTH_API_URL + '/register';

// Tweets APIs
const TWEETS_API_URL = ENDPOINT + '/admin/tweets';
const TWEETS_API_PAGINATION_URL = ENDPOINT + '/admin/tweets/pagination';

// Users APIs
const USERS_API_URL = ENDPOINT + '/admin/users';
const USERS_API_PAGINATION_URL = ENDPOINT + '/users/pagination';

// Collect APIs
const COLLECT_ASYNC = ENDPOINT + '/admin/collect_async';
const COLLECT_SYNC = ENDPOINT + '/admin/collect';

export {
    AUTH_API_REFRESH_URL,
    AUTH_API_VALIDATE_URL,
    AUTH_API_LOGIN_URL,
    AUTH_API_REGISTER_URL,
    TWEETS_API_URL,
    TWEETS_API_PAGINATION_URL,
    USERS_API_URL,
    USERS_API_PAGINATION_URL,
    COLLECT_ASYNC,
    COLLECT_SYNC,   
};
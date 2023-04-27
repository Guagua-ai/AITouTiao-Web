const LOCAL_ENDPOINT = 'http://localhost:8080';
const REMOTE_ENDPOINT = 'https://news.virtualdynamiclab.com';
const ENDPOINT = LOCAL_ENDPOINT;

const AUTH_API_URL = ENDPOINT + '/auth';
const AUTH_API_REFRESH_URL = ENDPOINT + '/auth/refresh';

const TWEETS_API_URL = ENDPOINT + '/admin/tweets';
const TWEETS_API_PAGINATION_URL = ENDPOINT + '/admin/tweets/pagination';

const USERS_API_URL = ENDPOINT + '/admin/users';
const USERS_API_PAGINATION_URL = ENDPOINT + '/users/pagination';

const LOGIN_URL = ENDPOINT + '/auth/login';
const REGISTER_URL = ENDPOINT + '/auth/register';

const COLLECT_ASYNC = ENDPOINT + '/admin/collect_async';
const COLLECT_SYNC = ENDPOINT + '/admin/collect';

export {
    TWEETS_API_URL,
    TWEETS_API_PAGINATION_URL,
    USERS_API_URL,
    USERS_API_PAGINATION_URL,
    LOGIN_URL,
    REGISTER_URL,
    COLLECT_ASYNC,
    COLLECT_SYNC,   
};
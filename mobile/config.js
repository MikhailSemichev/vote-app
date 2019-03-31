export default {
    REACT_APP_SERVICE_URL: process.env.REACT_APP_SERVICE_URL ?
        process.env.REACT_APP_SERVICE_URL.trim() // PRODUCTION MODE
        : 'https://va0.herokuapp.com' // DEVELOPMENT MODE
};

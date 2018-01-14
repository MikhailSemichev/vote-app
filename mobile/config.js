export default {
    SERVICE_URL: process.env.SERVICE_URL ?
        process.env.SERVICE_URL.trim() // PRODUCTION MODE
        : 'https://va0.herokuapp.com' // DEVELOPMENT MODE
};

export default {
    SERVICE_URL: process.env.SERVICE_URL ?
        process.env.SERVICE_URL.trim() // PRODUCTION MODE
        : 'http://localhost:3333' // DEVELOPMENT MODE
};

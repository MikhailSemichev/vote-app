export default {
    SERVICE_URL: process.env.SERVICE_URL ?
        process.env.SERVICE_URL.trim() // PRODUCTION MODE
        : 'http://vote-app-prod.eu-central-1.elasticbeanstalk.com/' // DEVELOPMENT MODE
};

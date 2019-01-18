export default {
    SERVICE_URL: process.env.SERVICE_URL ?
        'http://vote-app-prod.eu-central-1.elasticbeanstalk.com/' // PRODUCTION MODE
        : 'http://localhost:3333' // DEVELOPMENT MODE
};

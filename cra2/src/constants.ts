export const SERVICE_URL = process.env.SERVICE_URL
    ? process.env.SERVICE_URL.trim() // PRODUCTION MODE
    : 'http://localhost:3333'; // DEVELOPMENT MODE
export const ON_VOTE = 'ON_VOTE';
export const ON_TOPIC_CHANGE = 'ON_TOPIC_CHANGE';

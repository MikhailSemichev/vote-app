export const SERVICE_URL = process.env.SERVICE_URL
    ? process.env.SERVICE_URL.trim() // PRODUCTION MODE
    : 'http://localhost:3333'; // DEVELOPMENT MODE

export enum SOCKET_EVENTS {
    ON_VOTE = 'ON_VOTE',
    ON_TOPIC_CHANGE = 'ON_TOPIC_CHANGE',
}

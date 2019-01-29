import mongoose from 'mongoose';

const dbuser: string = 'vote-app';
const dbpassword: string = 'vote-app-1';

const connectionString: string = process.env.CONNECTION_STR ||
    `mongodb://${dbuser}:${dbpassword}@ds211088.mlab.com:11088/vote-app-dev`;

export function connect() {
    return mongoose.connect(connectionString);
}

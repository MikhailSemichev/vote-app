import axios from 'axios';
import config from '../config';
import { loginStore } from '../stores';

axios.defaults.baseURL = `${config.SERVICE_URL}/api`;

axios
    .interceptors
    .request
    .use(conf => {
        // eslint-disable-next-line
        conf.headers.ADMIN_PASSWORD = loginStore.userInfo.adminPassword;
        return conf;
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });

axios
    .interceptors
    .response
    .use(response => {
        // Do something with response data
        return response.data;
    }, error => {
        // Do something with response error
        return Promise.reject(error);
    });

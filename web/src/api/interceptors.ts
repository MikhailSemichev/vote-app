import axios from 'axios';
import { REACT_APP_SERVICE_URL } from '../constants';
import { loginStore } from '../stores';

axios.defaults.baseURL = `${REACT_APP_SERVICE_URL}/api`;

axios.interceptors.request.use(
    conf => {
        if (loginStore.userInfo) {
            conf.headers.ADMIN_PASSWORD = loginStore.userInfo.adminPassword;
        }
        return conf;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    },
);

import axios from 'axios';
import config from '../../config';

axios.defaults.baseURL = `${config.REACT_APP_SERVICE_URL}/api`;

axios.interceptors.request.use(
    conf => {
        // Do something before request is sent
        return conf;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        // Do something with response data
        return response.data;
    },
    error => {
        // Do something with response error
        return Promise.reject(error);
    }
);

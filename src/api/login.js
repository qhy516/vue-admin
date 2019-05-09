import axios from 'axios';

export const requestLogin = params => {
    return axios.post(`${base}/user/login`, params);
};
// let base = 'http://api.stockcash.net/admin';
import Vue from 'vue'
import axios from 'axios'
let base = 'http://localhost:9999/admin';



export const sendLoginVerifyCode = params => {
    return Vue.axios.post("http://localhost:9999/admin/user/getVerifyCode", {
        name: params.name,
        password: params.password
    });
};

export const requestLogin = params => {
    return axios.post(`${base}/user/login`, params);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {
        params: params
    });
};

export const getUserListPage = params => {
    return axios.get(`${base}/user/listpage`, {
        params: params
    });
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {
        params: params
    });
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {
        params: params
    });
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {
        params: params
    });
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, {
        params: params
    });
};
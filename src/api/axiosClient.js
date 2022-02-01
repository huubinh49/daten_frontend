//http client for my website
import axios from 'axios'
import queryString from 'query-string'
import cookie from 'react-cookies'
const axiosClient = axios.create({
    baseURL: "http://localhost:5000/",
    headers:{
        "Content-Type": "application/json",
        "X-CSRFTOKEN": cookie.load("csrftoken")
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(function(config){
    const access_token = sessionStorage.getItem('access_token', "");
    if(access_token){
        config.headers['Authorization'] = `JWT ${access_token}`;
    }
    config.headers["Content-Type"] = "application/json"         
    return config;
}, err=>{
    Promise.reject(err);
})

axiosClient.interceptors.response.use((response)=>{
    if(response && response.data){
        return response.data;
    }
    return response;
}, (error)=>{
    throw error;
});

axiosClient.defaults.xsrfCookieName= "csrftoken";
axiosClient.defaults.xsrfHeaderName = "X-CSRFTOKEN";

export default axiosClient;
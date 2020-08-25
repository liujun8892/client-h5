// var root = process.env.VUE_APP_API_URL;
import axios from "axios";
import qs from "qs";
import store from '../../store';
import {
    Toast
} from "vant";
import clearStorage from './clear'
// import router from '../../router'
import {GetQueryString} from '../utils/mixin'

var root =store.state.UserInfo.baseURL.test;



console.log('root', root)

// axios 配置

axios.defaults.timeout = 50000;

axios.defaults.baseURL = root + '/api';

axios.defaults.withCredentials = false;

// http request 拦截器

axios.interceptors.request.use( //请求前拦截

    config => {

        console.log(config)
        if (config.method == "post" && config.url.indexOf("/upload/img") <= 0) {
            config.data = qs.stringify(config.data);
        }
        if (config.method == "post" && config.url.indexOf("/upload/img") > 0) {
            config.headers = {
                Accept: "application/json, text/javascript, */*",
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryhwvBOffcBtcVGV8f"
            };
        } else {
            config.headers = {
                Accept: "application/json, text/javascript, */*",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            };

        }
        return config;
    },

    err => {

        return Promise.reject(err);

    }

);



// http response 拦截器

axios.interceptors.response.use(
    response => {
        // console.log(response, 92)
        //请先登录
        if (response.data.code == "1001" || response.data.code == "1003" || response.data.code == "1410" ) {
            // 错误
            let instance = Toast(response.data.msg);
            let tem = null;
            console.log(response.data);
            // return false;
            // 清除Session
            clearStorage();
            tem = setTimeout(() => {
                instance.close();
                // router.push("/h5");
                if(window.location.href.indexOf('answer')!=-1){
                    window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=questionnaire';
                }else if(window.location.href.indexOf('article')!=-1){
                    window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=article&article_id=' + GetQueryString('article_id');
                }else{
                    let url = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=h5login&course_id=' + GetQueryString('course_id');
                    if(GetQueryString('invite')){
                        url = url+ "&invite=" + GetQueryString('invite')
                    }
                    window.location.href = url;
                }
                clearTimeout(tem);
            }, 1000);
            throw response.data.msg; //返回错误中断请求
        }
        return response;
    },

    error => {

        //请先登录

        if (error.response.data.status == 2) {

            //请重新登录
            let tem = null;
            let instance = Toast(error.response.data.msg);
            // 清除Session
            clearStorage();
            tem = setTimeout(() => {
                instance.close();
                if(window.location.href.indexOf('answer')!=-1){
                    window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=questionnaire';
                }else if(window.location.href.indexOf('article')!=-1){
                    window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=article&article_id=' + GetQueryString('article_id');
                }else{
                    let url = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=h5login&course_id=' + GetQueryString('course_id');
                    if(GetQueryString('invite')){
                        url = url+ "&invite=" + GetQueryString('invite')
                    }
                    window.location.href = url;
                }
                clearTimeout(tem);
            }, 1000);

            return false;

        }

        return Promise.reject(error.response.data);

    }

);


export function fetch(url, params = {}) {

    return new Promise((resolve, reject) => {

        axios.get(url, {
                params: params
            })

            .then(response => {

                resolve(response.data);

            })

            .catch(err => {

                reject(err);

            });

    });

}




export function post(url, data = {}, responseType) {
    console.log('url', url)

    return new Promise((resolve, reject) => {
        axios.post(url, data, responseType).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}





export function patch(url, data = {}) {

    return new Promise((resolve, reject) => {

        axios.patch(url, data).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}




export function put(url, data = {}) {

    return new Promise((resolve, reject) => {

        axios.put(url, data).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}

export function get(url, data = {}) {
    console.log(data, 'data')
    return new Promise((resolve, reject) => {

        axios.get(url, {
            params: data
        }).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}



export function regist(val) {

    Toast(val);

}